const User = require('../collections/users.collection');
const UserInfo = require('../collections/user-infos.collection');
const { error, hash } = require('../lib/utils');

const findUserInfos = (query, projection = {}, options = {}) => new Promise((resolve, reject) => {
  UserInfo.find(query, projection, options).select({ __v: 0 }).exec((err, data) => {
    if (err) reject(new Error(err));
    resolve(data);
  });
});

const createUserInfos = (req, res) => {
  const { userInfos } = req.body;
  const currentUserInfo = new UserInfo(userInfos);
  currentUserInfo.save((err, data) => {
    if (err) {
      res.send(500, err.message);
      error('createUserInfos', 'user-infos.crud.js:21', err);
    }
    res.send(data._id);
  });
};

const readUserInfos = (req, res) => {
  const { query, projection, options } = req.query;
  findUserInfos(query, projection, options)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(500, err.message);
      error('readUserInfos', 'user-infos.crud.js:36', err);
    });
};

const updateUserInfos = (req, res) => {
  const { query, update } = req.body;

  UserInfo.updateMany(query, update, (err, data) => {
    if (err) {
      res.send(500, err.message);
      error('updateUserInfos', 'user-infos.crud.js:47', err);
    }
    res.send(data);
  });
};

const deleteUserInfos = (req, res) => {
  const { query } = req.body;
  UserInfo.deleteMany(query, (err) => {
    if (err) {
      res.send(500, err.message);
      error('deleteIserInfos', 'user-infos.crud.js:58', err);
    }
  });
};

const generateFake = (req, res) => {
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
        userInfos.save().then((userInfosDatas) => {
          User.update({ _id: user._id }, { $push: { contactIds: userInfosDatas._id } }, () => {
            datas.splice(0, 1);
            // eslint-disable-next-line no-param-reassign
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
