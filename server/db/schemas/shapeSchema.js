const mongoose = require('mongoose')

exports.shapeSchema = async () => {
  //schema
  const shapeScheme = new mongoose.Schema({
    type: String,
    xCoord: Number,
    yCoord: Number,
    props: Object,
    transform: Object,
    zIndex: Number
  })
}
