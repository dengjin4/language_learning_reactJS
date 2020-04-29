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

const LibSchema = new mongoose.Schema({
  name: {
    //category name "default" "lib1" "lib2"
    type: String,
    lowercase: true,
    trim: true
  },
  //Use user's id
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }, 
  words: [WordSchema]
});

const Library = new mongoose.model("Library", LibSchema);

module.exports = { Library };
