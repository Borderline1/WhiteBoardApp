const mongoose = require('mongoose')
const pkg = require('../../package.json')

const databaseName = pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '')

mongoose
  .connect(process.env.DATABASE_URL || `mongodb://localhost/${databaseName}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .catch(console.error.bind(console, 'connection error:'))

const db = mongoose.connection

db.once('open', () => {
  // we're connected!
  console.log('connected to db')
})

module.exports = db

// This is a global Mocha hook used for resource cleanup.
// Otherwise, Mocha v4+ does not exit after tests.
if (process.env.NODE_ENV === 'test') {
  after('close database connection', () => db.close())
}
