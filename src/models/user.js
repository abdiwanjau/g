const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  name: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:true,
    validate(email) {
      return validator.isEmail(email);
    }
  },
  password:{
    type:String,
    required:true,
    validate(pass) {
      return pass.length > 6
    }
  },
  tokens:[{
    token:{
      type:String
    }
  }]
})

userSchema.pre("save", async function(next) {
  const user = this;
  user.password = await bcrypt.hash(user.password,8);
  next()
})

userSchema.statics.findUser = async (email, password) => {
  // get the user by email
  const user = await User.findOne({ email });
  if(!user) {
    throw new Error("User not found")
  }
  const isOK = await bcrypt.compare(password,user.password);
  if(!isOK) {
    throw new Error("Login failed")
  }
  return user;
}

userSchema.methods.generateToken = async function() {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'thisisdope' , { expiresIn: '5 days' });
  user.tokens = [...user.tokens,{ token }];
  return token;
}

const User = mongoose.model('User',userSchema);

module.exports = User