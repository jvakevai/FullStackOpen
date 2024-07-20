const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username : {
    type: String,
    required: true,
    unique: true,
    minlength: 3
    },
    name: String,
    pwHash: {
      type: String,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
})
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.pwHash
    }
  })

module.exports = mongoose.model('User', userSchema)