const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema;

// Temporary
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  walletId: {
    type:mongoose.Schema.Yypes.ObjectId,
    ref:'Wallet'
  },
  portfolioId: {
    type:mongoose.Schema.Yypes.ObjectId,
    ref:'Portfolio'
  }
  // image: { type: String, required: true }
  
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);