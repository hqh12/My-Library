const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
}) 

//after remove, check book . if err : log err, else success
authorSchema.pre('remove',  function(next){
    Book.find({author : this.id}, (err, books) => {//DONT use fineOne because length will equal to null
        if (err) next(err)
        else if (books.length > 0) next(new Error('This author has books still'))
        else next()
        /* Cant use line below instead because below contain return . If we use return, code will stop at first if statement */
        //(err) ? next(err) : (books.length > 0) ? next(new Error('This author has books still')) : (err)
    })
})

module.exports = mongoose.model('Author', authorSchema)