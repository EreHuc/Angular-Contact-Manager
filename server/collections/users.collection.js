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

UsersSchema.options.toObject.transform = function (doc, ret) {
	// TODO: TEST THIS !!!!
	delete ret.password;
	return ret;
};

const User = mongoose.model('users', UsersSchema);

module.exports = User;
