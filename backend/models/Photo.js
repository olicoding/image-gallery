const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const photoSchema = new Schema({
  title: String,
  description: String,
  album: { type: mongoose.Schema.Types.ObjectId, ref: "Album" },
  cloudinaryURL: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
