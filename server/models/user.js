const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const profileSchema = new Schema({
  language: String,
  experienceYears: Number,
  level: Number,
});

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,

  profile: { type: profileSchema },
});
// this code will be executed before saving a user
userSchema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.salt = salt;
    this.password = hashedPassword;
  } catch (error) {
    next(error);
  }
});

userSchema.methods.validPassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model('User', userSchema);
