const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const albumSchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  photos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Photo" }],
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
