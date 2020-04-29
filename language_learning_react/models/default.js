const mongoose = require('mongoose')

const Translate = new mongoose.Schema({
  fl: String,
  def: [String]
});

const WordSchema = new mongoose.Schema({
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
  learnStatus: {
    type: Boolean,
    default: true
  }
});

const DefaultLibrary = new mongoose.model("DefaultWord", WordSchema);

module.exports = { DefaultLibrary };
