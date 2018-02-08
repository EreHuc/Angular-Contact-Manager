let User = require('../collections/users.collection');
let UserInfo = require('../collections/user-infos.collection');
let log = require('../lib/utils').log;
let error = require('../lib/utils').error;
let hash = require('../lib/utils').hash;

let findUserInfos = (query, projection = {}, options = {}) => {
	return new Promise((resolve, reject) => {
			UserInfo.find(query, projection, options).select({__v: 0}).exec((err, data) => {
				if (err) reject(new Error(err));
				resolve(data);
			});
		}
	);
};

let createUserInfos = (req, res, next) => {
	let userInfos = req.body.userInfos;
	let currentUserInfo = new UserInfo(userInfos);
	currentUserInfo.save((err, data) => {
		if (err) {
			res.send(500, err.message);
			error('createUserInfos', 'user-infos.crud.js:21', err);
		}
		res.send(data._id);
	});
};

let readUserInfos = (req, res, next) => {
	let query = req.query.query;
	let projection = req.query.projection;
	let options = req.query.options;
	findUserInfos(query, projection, options)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.send(500, err.message);
			error('readUserInfos', 'user-infos.crud.js:36', err);
		});
};

let updateUserInfos = (req, res, next) => {
	let query = req.body.query;
	let update = req.body.update;

	UserInfo.updateMany(query, update, (err, data) => {
		if (err) {
			res.send(500, err.message);
			error('updateUserInfos', 'user-infos.crud.js:47', err);
		}
		res.send(data);
	});
};

let deleteUserInfos = (req, res, next) => {
	let query = req.body.query;
	UserInfo.deleteMany(query, (err, data) => {
		if (err) {
			res.send(500, err.message);
			error('deleteIserInfos', 'user-infos.crud.js:58', err);
		}
	});
};

let generateFake = (req, res, next) => {
	User.findOne({username: 'admin'}, function (err, user) {
		let generateFakeData = (number) => {
			let fakeData = [];
			for (let i = 0; i < number; i++) {
				fakeData.push({
					"firstname" : hash(Math.ceil(Math.random() * 7)),
					"lastname" : hash(Math.ceil(Math.random() * 7)),
					"email" : `${hash(Math.ceil(Math.random() * 4))}.${hash(Math.ceil(Math.random() * 3))}@gmail.com`,
					"profilePicture" : "http://127.0.0.1:5000/people.png",
				});
			}
			return fakeData;
		};
		(function saveFakeData (datas, i) {
			if (datas.length) {
				let userInfos = new UserInfo(datas[0]);
				userInfos.save().then((userInfos) => {
					User.update({_id: user._id}, {$push: {contactIds: userInfos._id}}, function (err, upd) {
						datas.splice(0,1);
						saveFakeData(datas, ++i);
					});
				})
			} else {
			  res.send(200);
			}
		})(generateFakeData(15), 0)

	})
};

module.exports = {createUserInfos, readUserInfos, updateUserInfos, deleteUserInfos, findUserInfos, generateFake};
