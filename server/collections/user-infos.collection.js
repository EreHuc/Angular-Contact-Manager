const mongoose = require('mongoose');

const userInfosSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  birthday: Date,
  sexe: String,
  address: String,
  profilePicture: String,
  profileCover: String,
  userId: String,
  createdAt: Date,
  email: String
});

const UserInfo = mongoose.model('user-info', userInfosSchema);

module.exports = UserInfo;
