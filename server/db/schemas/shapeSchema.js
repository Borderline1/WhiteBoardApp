const mongoose = require('mongoose')
//schema
const elemSchema = new mongoose.Schema({
  _id: String,
  type: String,
  x: Number,
  y: Number,
  props: Object
})

//if methods need to be defined that happens here, before the model calls the schema

//model
let Elem = mongoose.model('Elem', elemSchema)

//exports
module.exports = Elem
