const mongoose = require('mongoose')
//schema
const roomSchema = new mongoose.Schema({
  _id: String,
  name: String
})

//if methods need to be defined that happens here, before the model calls the schema

//model
let Room = mongoose.model('Room', roomSchema)

//exports
module.exports = Room
