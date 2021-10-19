var mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	token: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
		expires: 86400 // 24 Hours
	}
});

var usertoken = mongoose.model('Tokens', tokenSchema);

module.exports = usertoken;