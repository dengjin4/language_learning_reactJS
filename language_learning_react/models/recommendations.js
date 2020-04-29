const mongoose = require("mongoose");

const Translate = new mongoose.Schema({
  fl: String,
  def: [String]
});

const recommendation = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    minlegth: 1,
    trim: true
  },
  source:{
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
    default:"en"
  },
  translation: [Translate],
  //Use user's id
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userName:{
    type: String,
    required: true,
    minlegth: 1,
    trim: true,
  }
});

const Recommendation = new mongoose.model("recommendations", recommendation);

module.exports = { Recommendation };
