const User = require('../collections/users.collection');
const UserInfo = require('../collections/user-infos.collection');
const error = require('../lib/utils').error;
const hash = require('../lib/utils').hash;

const findUserInfos = (query, projection = {}, options = {}) => new Promise((resolve, reject) => {
  UserInfo.find(query, projection, options).select({ __v: 0 }).exec((err, data) => {
    if (err) reject(new Error(err));
    resolve(data);
  });
});

const createUserInfos = (req, res, next) => {
  const userInfos = req.body.userInfos;
  const currentUserInfo = new UserInfo(userInfos);
  currentUserInfo.save((err, data) => {
    if (err) {
      res.send(500, err.message);
      error('createUserInfos', 'user-infos.crud.js:21', err);
    }
    res.send(data._id);
  });
};

const readUserInfos = (req, res, next) => {
  const query = req.query.query;
  const projection = req.query.projection;
  const options = req.query.options;
  findUserInfos(query, projection, options)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(500, err.message);
      error('readUserInfos', 'user-infos.crud.js:36', err);
    });
};

const updateUserInfos = (req, res, next) => {
  const query = req.body.query;
  const update = req.body.update;

  UserInfo.updateMany(query, update, (err, data) => {
    if (err) {
      res.send(500, err.message);
      error('updateUserInfos', 'user-infos.crud.js:47', err);
    }
    res.send(data);
  });
};

const deleteUserInfos = (req, res, next) => {
  const query = req.body.query;
  UserInfo.deleteMany(query, (err, data) => {
    if (err) {
      res.send(500, err.message);
      error('deleteIserInfos', 'user-infos.crud.js:58', err);
    }
  });
};

const generateFake = (req, res, next) => {
  User.findOne({ username: 'admin' }, (err, user) => {
    const generateFakeData = (number) => {
      const fakeData = [];
      for (let i = 0; i < number; i++) {
        fakeData.push({
          firstname: hash(Math.ceil(Math.random() * 7)),
          lastname: hash(Math.ceil(Math.random() * 7)),
          email: `${hash(Math.ceil(Math.random() * 4))}.${hash(Math.ceil(Math.random() * 3))}@gmail.com`,
          profilePicture: 'http://127.0.0.1:5000/people.png',
        });
      }
      return fakeData;
    };
    (function saveFakeData(datas, i) {
      if (datas.length) {
        const userInfos = new UserInfo(datas[0]);
        userInfos.save().then((userInfos) => {
          User.update({ _id: user._id }, { $push: { contactIds: userInfos._id } }, (err, upd) => {
            datas.splice(0, 1);
            saveFakeData(datas, ++i);
          });
        });
      } else {
        res.send(200);
      }
    }(generateFakeData(15), 0));
  });
};

module.exports = {
  createUserInfos, readUserInfos, updateUserInfos, deleteUserInfos, findUserInfos, generateFake,
};
