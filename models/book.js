const mongoose = require('mongoose')

const path = require('path')

const Author = require('./author')

const coverImageBasePath = 'uploads/bookCovers'//create directory to restore cover image path

const bookSchema = new mongoose.Schema({
    title : {
        type : String,
        required: true
    },
    description : {
        type : String
    },
    publishDate : {
        type : Date,
        required: true
    },
    pageCount: {
        type : Number,
        required : true
    },
    createdAt : {
        type: Date,
        required : true,
        default : Date.now
    }, 
    coverImageName : {
        type : String,
        required : true
    }, 
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Author', 
        required : true
    }
}) 

//create a virtual to get book cover link

bookSchema.virtual('coverImagePath').get(function(){
    if(this.coverImageName != null){
        return path.join('/', coverImageBasePath, this.coverImageName)//join /uploads/bookCovers/coverImagePath
    }
})


module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath