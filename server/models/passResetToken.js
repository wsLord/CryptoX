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
		expires: 600 // 10 mins
	}
});

module.exports = mongoose.model('passResetTokens', tokenSchema);