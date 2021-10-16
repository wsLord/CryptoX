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
	}
});

var usertoken = mongoose.model('Tokens', tokenSchema);

module.exports = usertoken;