let mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
	password: String,
	username: String,
	createdAt: Date,
	token: {
		verify: {type: String}
	},
	verified: Boolean,
	contactIds: [String]
});

let User = mongoose.model('users', UsersSchema);

module.exports = User;
