const usersCrud = require('../crud/users.crud');
const userInfosCrud = require('../crud/user-infos.crud');
const log = require('../lib/utils').log;

module.exports = function (app) {
  if (process.env.NODE_ENV !== 'production') {
    log('API', 'api.js:5', process.env);
    app.get('/api/', (req, res, next) => {
      log('API', 'api.js:8', 'api called');
      res.send(200);
    });
  }

  app.post('/api/users/insert', usersCrud.createUser);
  app.get('/api/users/get', usersCrud.readUsers);
  app.put('/api/users/update', usersCrud.updateUsers);
  app.delete('/api/users/delete', usersCrud.deleteUsers);
  app.get('/api/users/verify', usersCrud.verifyUser);
  app.get('/api/users/login', usersCrud.loginUser);
  app.put('/api/users/set-username', usersCrud.setUsername);
  app.get('/api/users/contact-list', usersCrud.getContactList);

  app.post('/api/users-infos/insert', userInfosCrud.createUserInfos);
  app.get('/api/users-infos/get', userInfosCrud.readUserInfos);
  app.put('/api/users-infos/update', userInfosCrud.updateUserInfos);
  app.delete('/api/users-infos/delete', userInfosCrud.deleteUserInfos);

  app.get('/api/mock-user-infos', userInfosCrud.generateFake);
};
