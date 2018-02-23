const mongoose = require('mongoose');

const UsersSchema = new mongoose.Schema({
  password: String,
  username: String,
  createdAt: Date,
  token: {
    verify: { type: String }
  },
  verified: Boolean,
  contactIds: [String]
});

const User = mongoose.model('users', UsersSchema);

module.exports = User;
