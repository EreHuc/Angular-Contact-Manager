const utils = require('../lib/utils');
const User = require('../collections/users.collection');
const UserInfo = require('../collections/user-infos.collection');
const bcrypt = require('bcrypt');
const emails = require('../lib/emails');
const userInfosCrud = require('./user-infos.crud');
const log = require('../lib/utils').log;
const error = require('../lib/utils').error;

// CRUD : CREATE READ UPDATE DELETE

const findUsers = (query = {}, projection = {}, options = {}) => new Promise((resolve, reject) => {
	User.find(query, projection, options).select({password: 0, __v: 0}).exec((err, data) => {
		if (err) reject(new Error(err));
		resolve(data);
	});
});

const updateManyUsers = (query, update) => new Promise((resolve, reject) => {
	User.updateMany(query, update, (err, data) => {
		if (err) {
			reject(new Error(err));
		}
		resolve(data);
	});
});

const createUser = (req, res, next) => {
	const userObj = {
		username: req.body.email,
		password: req.body.password,
		verified: false,
		createdAt: new Date(),
	};
	const userInfoObj = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		createdAt: new Date(),
		profilePicture: `http://${process.env.host}:${process.env.port}/people.png`,
	};
	findUsers({username: userObj.email})
		.then((data) => {
			if (data.length) {
				res.send(400, 'Email already taken');
			} else {
				bcrypt.hash(userObj.password, 10, (err, hash) => {
					if (err) {
						res.send(500, err.message);
						error('createUser', 'users.crud.js:57', err);
					}
					userObj.password = hash;
					const currentUser = new User(userObj);
					currentUser.save((err, user) => {
						if (err) {
							res.send(500, err.message);
							error('createUser', 'users.crud.js:64', err);
						}
						userInfoObj.userId = user._id;
						const currentUserInfo = new UserInfo(userInfoObj);
						currentUserInfo.save((err, userInfo) => {
							if (err) {
								res.send(500, err.message);
								error('createUser', 'users.crud.js:71', err);
							}
							const userDetal = {
								email: userInfo.email,
								firstname: userInfo.firstname,
								lastname: userInfo.lastname,
							};
							emails.sendVerificationMail(userDetal)
								.then((data) => {
									updateManyUsers({_id: user._id}, {$set: {token: {verify: data.hash}}})
										.then((data) => {
											res.send(user._id);
										})
										.catch((err) => {
											res.send(500, err.message);
											error('findUsers', 'users.crud.js:86', err);
										});
								})
								.catch((err) => {
									res.send(500, err.message);
									error('findUsers', 'users.crud.js:91', err);
								});
						});
					});
				});
			}
		})
		.catch((err) => {
			res.send(500, err.message);
			error('findUsers', 'users.crud.js:99', err);
		});
};

const readUsers = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const projection = utils.parseJson(req.body.projection) || {};
	const options = utils.parseJson(req.body.options) || {};
	findUsers(query, projection, options)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			error('readUsers', 'users.crud.js:114', err);
			res.send(500, err.message);
		});
};

const updateUsers = (req, res, next) => {
	const query = req.body.query;
	const update = req.body.update;
	updateManyUsers(query, update)
		.then((data) => {
			res.send(data);
		})
		.catch((err) => {
			res.send(500, err.message);
			error('updateUsers', 'users.crud.js:128', err);
		});
};

const deleteUsers = (req, res, next) => {
	const query = req.body.query;
	const projection = req.body.projection || {};
	const options = req.query.options || {};
	if (!query || typeof query !== 'object' || (Object.keys(query).length <= 1 && !query._id)) {
		res.send(500, 'Invalid auery');
	} else {
		findUsers(query, projection, options)
			.then((users) => {
				users.forEach((user) => {
					UserInfo.deleteOne({userId: user._id}, (err, data) => {
						if (err) {
							res.send(500, err.message);
							error('deleteUsers', 'users.crud.js:142', err);
						}
						User.deleteOne({_id: user._id}, (err, data) => {
							if (err) {
								res.send(500, err.message);
								error('deleteUsers', 'users.crud.js:147', err);
							}
						});
					});
				});
				res.send(200);
			})
			.catch((err) => {
				res.send(500, err.message);
				error('deleteUser', 'users.crud.js:157', err);
			});
	}
};

const loginUser = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const password = utils.parseJson(req.body.password).toString();
	User.findOne(query, {__v: 0, token: 0}, (err, user) => {
		if (err) {
			res.send(500, err.message);
			error('loginUser', 'users.crud.js:166', err);
		} else {
			log('', 'users.crud.js:168', typeof password);
			if (user && user.verified) {
				bcrypt.compare(password, user.password, (err, data) => {
					if (err) {
						res.send(500, err.message);
						error('loginUser', 'users.crud.js:171', err);
					} else if (data) {
						let currentUser = {};
						currentUser = Object.assign(currentUser, user.toObject());
						delete currentUser.password;
						userInfosCrud.findUserInfos({userId: user._id})
							.then((userInfos) => {
								currentUser.userInfos = userInfos.length ? userInfos[0] : null;
								res.send(currentUser);
							})
							.catch((err) => {
								res.send(500, err.message);
								error('loginUser', 'users.crud.js:183', err);
							});
					} else {
						res.send(400, 'Invalid password');
					}
				});
			} else {
				res.send(400, 'Account verification is required');
			}
		}
	});
};

const verifyUser = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	findUsers(query)
		.then((users) => {
			if (users.length) {
				let user = {};
				user = Object.assign(user, users[0].toObject());
				userInfosCrud.findUserInfos({userId: user._id}, {_id: 0, createdAt: 0, userId: 0})
					.then((userInfos) => {
						user.userInfos = userInfos.length ? userInfos[0] : null;
						res.send(user);
					})
					.catch((err) => {
						res.send(500, err);
						error('verifyUser', 'users.crud.js:210', err);
					});
			} else {
				res.status(400).send('No such user');
			}
		})
		.catch((err) => {
			res.send(500, err);
			error('verifyUser', 'users.crud.js:199', err);
		});
};

const setUsername = (req, res, next) => {
	const username = utils.parseJson(req.body.username);
	const userId = utils.parseJson(req.body.userId);
	if (username) {
		if (username.length < 4) {

		}
		findUsers({username})
			.then((users) => {
				if (users.length) {
					res.send(400, 'username already taken');
				} else {
					updateManyUsers({_id: userId}, {$set: {username, verified: true}, $unset: {token: {}}})
						.then((data) => {
							res.send({ username });
						})
						.catch((err) => {
							res.send(500, err);
							error('setusername', 'users.crud.js:237', err);
						});
				}
			})
			.catch((err) => {
				res.send(500, err);
				error('setUsername', 'users.crud.js:238', err);
			});
	} else {
		res.send(400, 'username is required');
	}
};

const getContactList = (req, res, next) => {
	const userId = utils.parseJson(req.params.userId);
	findUsers({_id: userId}, {
		emails: 0, token: 0, verified: 0, createdAt: 0, username: 0,
	})
		.then((users) => {
			if (users.length) {
				let user = {};
				user = Object.assign({}, users[0].toObject());
				console.log(user);
				if (user.contactIds) {
					userInfosCrud.findUserInfos({userId: {$in: user.contactIds}})
						.then((userInfos) => {
							console.log('users.crud.js:265 - ', userInfos);
							res.send(userInfos);
						})
						.catch((err) => {
							res.send(500, err);
							error('getContactList', 'users.crud.js:268', err);
						});
				} else {
					res.send([]);
				}
			} else {
				res.send(400, 'No such user');
			}
		})
		.catch((err) => {
			res.send(500, err);
			error('getContactList', 'users.crud.js:260', err);
		});
};

module.exports = {
	createUser, readUsers, updateUsers, deleteUsers, loginUser, verifyUser, setUsername, getContactList,
};
