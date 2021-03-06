let mongoose = require('mongoose');

let userInfosSchema = new mongoose.Schema({
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

let UserInfo = mongoose.model('user-info', userInfosSchema);

module.exports = UserInfo;
