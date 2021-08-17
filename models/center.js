const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CenterSchema = new Schema({
  name: String,
  description: String,
  location: String,
  image: String,
  yearEst: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Center", CenterSchema);
