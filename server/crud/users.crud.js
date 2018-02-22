const utils = require('../lib/utils');
const User = require('../collections/users.collection');
const UserInfo = require('../collections/user-infos.collection');
const bcrypt = require('bcrypt');
const emails = require('../lib/emails');
const userInfosCrud = require('./user-infos.crud');
const { log, error } = require('../lib/utils');

const defaultPictureProfile = `http://${process.env.host}:${process.env.port}/people.png`;

// CRUD : CREATE READ UPDATE DELETE

const findUsers = (query = {}, projection = {}, options = {}) => new Promise((resolve, reject) => {
	User.find(query, projection, options).select({password: 0, __v: 0}).exec((err, data) => {
		if (err) reject(new Error(err));
		resolve(data);
	});
});

const findOneUser = (query) => new Promise((resolve, reject) => {
	User.findOne(query).select({__v: 0, token: 0}).exec((err, data) => {
		if (err) reject(err);
		resolve(data);
	})
});

const updateManyUsers = (query, update) => new Promise((resolve, reject) => {
  User.updateMany(query, update, (err, data) => {
    if (err) {
      reject(new Error(err));
    }
    resolve(data);
  });
});

const createUserObject = (username, password, createdAt = new Date(), verified = false) => {
	return freezeObject({username, password, createdAt, verified});
};

const createUserInfoObject = (firstname, lastname, email, createdAt = new Date(), profilePicture = defaultPictureProfile) => {
	return freezeObject({firstname, lastname, email, createdAt, profilePicture});
};

// TODO move 4 next func to utils.js

const throwError = (res, err, status = 500) => {
	res.status(status).send(err);
};

const sendData = (res, data) => {
	res.send(data);
};

const createMongooseObject = (model) => {
	return (data) => {
		return new model(data);
	};
};

const freezeObject = (object) => {
	return Object.freeze(object);
};

// TODO move 2 next func into user.collection.js and user-info.collection.js respectively

const createMongooseUserObject = createMongooseObject(User);

const createMongooseUserInfoObject = createMongooseObject(UserInfo);

const throwEmailTakenError = (res) => {
	return throwError(res, 'Email already taken', 400);
};

const createUserObjectWithHashedPassword = (userObject, password) => {
	return freezeObject({...userObject, password});
};

const createUserInfoObjectWithUserId = (userInfoObject, userId) => {
	return freezeObject({...userInfoObject, userId});
};

const createMailUserDetail = (firstname, lastname, email) => {
	return freezeObject({firstname, lastname, email});
};

const createLoggedUser = (loggedUser, infoUser) => {
	const userInfos = infoUser.length ? infoUser[0] : null;
	return freezeObject({... loggedUser, userInfos});
};

const createUser = (req, res, next) => {
	const userObj = createUserObject(req.body.email, req.body.password);
	const userInfoObj = createUserInfoObject(req.body.firstname, req.body.lastname, req.body.email);
	findUsers({username: userInfoObj.email})
		.then((data) => {
			if (data.length) {
				throwEmailTakenError(res);
			} else {
				bcrypt.hash(userObj.password, 10, (err, hash) => {
					if (err) {
						throwError(res, err.message);
						error('createUser', 'users.crud.js:57', err);
					}
					const currentUser = createMongooseUserObject(createUserObjectWithHashedPassword(userObj, hash));
					currentUser.save((err, user) => {
						if (err) {
							throwError(res, err.message);
							error('createUser', 'users.crud.js:64', err);
						}
						const currentUserInfo = createMongooseUserInfoObject(createUserInfoObjectWithUserId(userInfoObj, user._id));
						currentUserInfo.save((err, userInfo) => {
							if (err) {
								throwError(res, err.message);
								error('createUser', 'users.crud.js:71', err);
							}
							const userDetail = createMailUserDetail(userInfo.firstname, userInfo.lastname, userInfo.email);
							emails.sendVerificationMail(userDetail)
								.then((data) => {
									updateManyUsers({_id: user._id}, {$set: {token: {verify: data.hash}}})
										.then((data) => {
											sendData(res, data);
										})
										.catch((err) => {
											throwError(res, err.message);
											error('findUsers', 'users.crud.js:86', err);
										});
								})
								.catch((err) => {
									throwError(res, err.message);
									error('findUsers', 'users.crud.js:91', err);
								});
						});
					});
				});
			}
		})
		.catch((err) => {
			throwError(res, err.message);
			error('findUsers', 'users.crud.js:99', err);
		});
};

const readUsers = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const projection = utils.parseJson(req.body.projection) || {};
	const options = utils.parseJson(req.body.options) || {};
	findUsers(query, projection, options)
		.then((data) => {
			sendData(res, data);
		})
		.catch((err) => {
			error('readUsers', 'users.crud.js:114', err);
			throwError(res, err.message);
		});
};

const updateUsers = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const update = utils.parseJson(req.body.update);
	updateManyUsers(query, update)
		.then((data) => {
			sendData(res, data);
		})
		.catch((err) => {
			throwError(res, err.message);
			error('updateUsers', 'users.crud.js:128', err);
		});
};

const deleteUsers = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const projection = utils.parseJson(req.body.projection) || {};
	const options = utils.parseJson(req.query.options) || {};
	if (!query || typeof query !== 'object' || (Object.keys(query).length <= 1 && !query._id)) {
		throwError(res, 'Invalid query');
	} else {
		findUsers(query, projection, options)
			.then((users) => {
				users.forEach((user) => {
					UserInfo.deleteOne({userId: user._id}, (err, data) => {
						if (err) {
							throwError(res, err.message);
							error('deleteUsers', 'users.crud.js:142', err);
						}
						User.deleteOne({_id: user._id}, (err, data) => {
							if (err) {
								throwError(res, err.message);
								error('deleteUsers', 'users.crud.js:147', err);
							}
						});
					});
				});
				sendData(200);
			})
			.catch((err) => {
				throwError(res, err.message);
				error('deleteUser', 'users.crud.js:157', err);
			});
	}
};

const loginUser = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	const password = utils.parseJson(req.body.password).toString();
	findOneUser(query)
		.then((user) => {
			if (user && user.verified) {
				bcrypt.compare(password, user.password, (err, data) => {
					if (err) {
						throwError(res, err.message);
						error('loginUser', 'users.crud.js:171', err);
					} else if (data) {
						userInfosCrud.findUserInfos({userId: user._id})
							.then((userInfos) => {
								sendData(res, createLoggedUser(user.toObject(), userInfos));
							})
							.catch((err) => {
								throwError(res, err.message);
								error('loginUser', 'users.crud.js:183', err);
							});
					} else {
						throwError(res, 'Invalid password', 400);
					}
				});
			} else {
				throwError(res, 'Account verification is required', 400);
			}
		})
		.catch((err) => {
			throwError(res, err);
			error('loginUser', 'users.crud.js:166', err);
		});
};

const verifyUser = (req, res, next) => {
	const query = utils.parseJson(req.body.query);
	// TODO: URGENT TEST
	findOneUser(query)
		.then((user) => {
			if (user) {
				userInfosCrud.findUserInfos({userId: user._id}, {_id: 0, createdAt: 0, userId: 0})
					.then((userInfos) => {
						sendData(res, createLoggedUser(user, userInfos))
					})
					.catch((err) => {
						throwError(res, err.message);
						error('verifyUser', 'users.crud.js:210', err);
					});
			} else {
				throwError(res, 'No such user', 400);
			}
		})
		.catch((err) => {
			throwError(res, err.message);
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
					throwError(res, 'Username already taken', 400);
				} else {
					updateManyUsers({_id: userId}, {$set: {username, verified: true}, $unset: {token: {}}})
						.then(() => {
							sendData(res, { username });
						})
						.catch((err) => {
							throwError(res, err.message);
							error('setUsername', 'users.crud.js:237', err);
						});
				}
			})
			.catch((err) => {
				throwError(res, err.message);
				error('setUsername', 'users.crud.js:238', err);
			});
	} else {
		throwError(res, 'Username is required', 400);
	}
};

const getContactList = (req, res) => {
  const userId = utils.parseJson(req.params.userId);
  findUsers({ _id: userId }, {
    emails: 0, token: 0, verified: 0, createdAt: 0, username: 0,
  })
    .then((users) => {
      if (users.length) {
        const user = Object.assign({}, users[0].toObject());
        if (user.contactIds) {
          userInfosCrud.findUserInfos({ userId: { $in: user.contactIds } })
            .then((userInfos) => {
              log('getContactList', 'users.crud.js:265 - ', userInfos);
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

const addContact = (req, res) => {
  const userInfoObj = utils.parseJson(req.body.userInfo);
  const sender = utils.parseJson(req.body.sender);
  const userObj = {
    username: userInfoObj.email,
    contactIds: [sender],
    verified: false,
    createdAt: new Date()
  };
  userInfoObj.birthdate = new Date(userInfoObj.birthdate);
  userInfoObj.profilePicture = userInfoObj.profilePicture ? userInfoObj.profilePicture : `http://${process.env.host}:${process.env.port}/people.png`;
  findUsers({ username: userInfoObj.email })
    .then((users) => {
      if (users.length) {
        res.status(400).send('Email already taken');
      }
      const currentUser = new User(userObj);
      currentUser.save((errUserSave, user) => {
        if (errUserSave) {
          error('addContact', 'users.crud.js', errUserSave);
          res.status(500).send(errUserSave.message);
        }
        userInfoObj.userId = user._id;
        const currentUserInfo = new UserInfo(userInfoObj);
        currentUserInfo.save((errUserInfoSave, userInfo) => {
          if (errUserInfoSave) {
            res.status(500).send(errUserInfoSave.message);
            error('createUser', 'users.crud.js:71', errUserInfoSave);
          }
          const update = { $push: { contactIds: userInfo.userId } };
          updateManyUsers({ _id: sender }, update)
            .catch((err) => {
              error('addContact', 'users.crud.js', err);
            });
          res.send(userInfo);
        });
      });
    })
    .catch((err) => {
      error('addContact', 'users.crud.js', err);
      res.status(500).send(err);
    });
};

module.exports = {
  createUser,
  readUsers,
  updateUsers,
  deleteUsers,
  loginUser,
  verifyUser,
  setUsername,
  getContactList,
  addContact
};
