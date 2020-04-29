/* User model */
"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// create an image schema
// const imageSchema = mongoose.Schema({
//   image_id: {
//       type: String,
//       required: true
//   },
//   image_url: {
//       type: String,
//       required: true
//   }
// });


// Making a Mongoose model a little differently: a Mongoose Schema
// Allows us to add additional functionality.
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 1
  },
  type:{
    type: String,
    required: true,
    minlength: 1
  },
  suspend:{
    type:Boolean,
    default:false
  },
  image_id: {
    type: String,
    required: true
  },
  image_url: {
    type: String,
    required: true
  },
  login: {
    type: Boolean,
    default:false
  }
});

// An example of Mongoose middleware.
// This function will run immediately prior to saving the document
// in the database.
UserSchema.pre("save", function(next) {
  const user = this; // binds this to User document instance

  // checks to ensure we don't hash password more than once
  if (user.isModified("password")) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// A static method on the document model.
// Allows us to find a User document by comparing the hashed password
//  to a given one, for example when logging in.
UserSchema.statics.findByNamePassword = function(name, password) {
  const User = this; // binds this to the User model
  console.log(name,password)

  // First find the user by their name
  return User.findOne({ name: name }).then(user => {
    if (!user) {
      return Promise.reject(); // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result && !user.suspend) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// make a model using the User schema
const User = mongoose.model("User", UserSchema);

module.exports = { User };
