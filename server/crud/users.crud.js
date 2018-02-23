const utils = require('../lib/utils');
const User = require('../collections/users.collection');
const UserInfo = require('../collections/user-infos.collection');
const bcrypt = require('bcrypt');
const emails = require('../lib/emails');
const userInfosCrud = require('./user-infos.crud');
const { log, error } = require('../lib/utils');

// CRUD : CREATE READ UPDATE DELETE

const findUsers = (query = {}, projection = {}, options = {}) => new Promise((resolve, reject) => {
  User.find(query, projection, options).select({ password: 0, __v: 0 }).exec((err, data) => {
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

const createUser = (req, res) => {
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
  findUsers({ username: userInfoObj.email })
    .then((data) => {
      if (data.length) {
        res.send(400, 'Email already taken');
      } else {
        bcrypt.hash(userObj.password, 10, (err, hash) => {
          if (err) {
            res.status(500).send(err.message);
            error('createUser', 'users.crud.js:57', err);
          }
          userObj.password = hash;
          const currentUser = new User(userObj);
          currentUser.save((errUserSave, user) => {
            if (errUserSave) {
              res.send(500, errUserSave.message);
              error('createUser', 'users.crud.js:64', errUserSave);
            }
            userInfoObj.userId = user._id;
            const currentUserInfo = new UserInfo(userInfoObj);
            currentUserInfo.save((errUserInfoSave, userInfo) => {
              if (errUserInfoSave) {
                res.send(500, errUserInfoSave.message);
                error('createUser', 'users.crud.js:71', errUserInfoSave);
              }
              const userDetail = {
                email: userInfo.email,
                firstname: userInfo.firstname,
                lastname: userInfo.lastname,
              };
              emails.sendVerificationMail(userDetail)
                .then((token) => {
                  updateManyUsers({ _id: user._id }, { $set: { token: { verify: token.hash } } })
                    .then(() => {
                      res.send(user._id);
                    })
                    .catch((errUpdateUsersToken) => {
                      res.send(500, errUpdateUsersToken.message);
                      error('findUsers', 'users.crud.js:86', errUpdateUsersToken);
                    });
                })
                .catch((errVerfiMail) => {
                  res.send(500, errVerfiMail.message);
                  error('findUsers', 'users.crud.js:91', errVerfiMail);
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

const readUsers = (req, res) => {
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

const updateUsers = (req, res) => {
  const { query, update } = req.body;
  updateManyUsers(query, update)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(500, err.message);
      error('updateUsers', 'users.crud.js:128', err);
    });
};

const deleteUsers = (req, res) => {
  const { query } = req.body;
  const projection = req.body.projection || {};
  const options = req.query.options || {};
  if (!query || typeof query !== 'object' || (Object.keys(query).length <= 1 && !query._id)) {
    res.send(500, 'Invalid auery');
  } else {
    findUsers(query, projection, options)
      .then((users) => {
        users.forEach((user) => {
          UserInfo.deleteOne({ userId: user._id }, (err) => {
            if (err) {
              res.send(500, err.message);
              error('deleteUsers', 'users.crud.js:142', err);
            }
            User.deleteOne({ _id: user._id }, (errDeleteUser) => {
              if (errDeleteUser) {
                res.send(500, errDeleteUser.message);
                error('deleteUsers', 'users.crud.js:147', errDeleteUser);
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

const loginUser = (req, res) => {
  const query = utils.parseJson(req.body.query);
  const password = utils.parseJson(req.body.password).toString();
  User.findOne(query, { __v: 0, token: 0 }, (err, user) => {
    if (err) {
      res.send(500, err.message);
      error('loginUser', 'users.crud.js:166', err);
    } else {
      log('', 'users.crud.js:168', typeof password);
      if (user && user.verified) {
        bcrypt.compare(password, user.password, (errBCrypt, data) => {
          if (errBCrypt) {
            res.send(500, errBCrypt.message);
            error('loginUser', 'users.crud.js:171', errBCrypt);
          } else if (data) {
            let currentUser = {};
            currentUser = Object.assign(currentUser, user.toObject());
            delete currentUser.password;
            userInfosCrud.findUserInfos({ userId: user._id })
              .then((userInfos) => {
                currentUser.userInfos = userInfos.length ? userInfos[0] : null;
                res.send(currentUser);
              })
              .catch((errFindUserInfos) => {
                res.send(500, errFindUserInfos.message);
                error('loginUser', 'users.crud.js:183', errFindUserInfos);
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

const verifyUser = (req, res) => {
  const query = utils.parseJson(req.body.query);
  findUsers(query)
    .then((users) => {
      if (users.length) {
        let user = {};
        user = Object.assign(user, users[0].toObject());
        userInfosCrud.findUserInfos({ userId: user._id }, { _id: 0, createdAt: 0, userId: 0 })
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

const setUsername = (req, res) => {
  const username = utils.parseJson(req.body.username);
  const userId = utils.parseJson(req.body.userId);
  if (username) {
    if (username.length < 4) {
      // TODO verify username length
    }
    findUsers({ username })
      .then((users) => {
        if (users.length) {
          res.send(400, 'Username already taken');
        } else {
          updateManyUsers(
            { _id: userId },
            {
              $set: { username, verified: true },
              $unset: { token: {} },
            }
          )
            .then(() => {
              res.send(username);
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
