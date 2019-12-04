const mongoose = require('mongoose')
//schema
const elemSchema = new mongoose.Schema({
  _id: String,
  type: String,
  x: Number,
  y: Number,
  props: Object
})

const roomSchema = new mongoose.Schema({
  _id: String,
  name: String,
  elements: [elemSchema]
})
//if methods need to be defined that happens here, before the model calls the schema

//model
let Elem = mongoose.model('Elem', elemSchema)
let Room = mongoose.model('Room', roomSchema)

//exports
module.exports = {Elem, Room}
