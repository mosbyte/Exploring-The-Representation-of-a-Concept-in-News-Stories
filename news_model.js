const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 
let News = new Schema({
  title: {
    type: String
  },
  contents: {
    type: String
  },
  published: {
    type: String
  },
  source: {
    type: String
  },
  link: {
    type: String,
    unique: true
  },
  category: {
    type: String
  },
  status: {
    type: String
  },
  tags: {
    type: [String]
  },
  CreatedAt: {
    type: Date,
  },
  UpdatedAt: {
    type: Date,
    default: Date.now
  }}
);
var chant = mongoose.model('all_chant_news', News);
var ritual = mongoose.model('all_ritual_news', News);

module.exports = {
  chant: chant,
  ritual: ritual
}
