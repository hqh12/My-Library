const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const path = require('path')
const fs = require('fs')
const Author = require('../models/author')
const multer = require('multer');//multer is a library to upload file
const { length } = require('mongoose/lib/helpers/query/validOps');

const imageMineTypes = ['image/jpeg','image/gif','image/png'] 

const uploadPath = path.join('public', Book.coverImageBasePath)//sum 2 path to directory coverImageBasePath

const upload = multer({
    dest : uploadPath, // destination:  The folder to which the file has been saved
    fileFilter : (req, file, callback) => {//Set this to a function to control which files should be uploaded and which should be skipped.
        callback(null, imageMineTypes.includes(file.mimetype))//setup callback when file is uploaded
    }//mimetype is mine type of the file
})

//get all book routes
router.get('/', async(req, res) => {
    //define query
    let query = Book.find()
    //check title
    if (req.query.searchTitle != null && req.query.searchTitle != ''){
        query = query.regex('title', new RegExp(req.query.searchTitle, 'i'))
    }
    //check published before
    if (req.query.searchPublishedBefore != null && req.query.searchPublishedBefore != ''){
        query = query.lte('publishDate', req.query.searchPublishedBefore)
    }
    //check published after
    if (req.query.searchPublishedAfter != null && req.query.searchPublishedAfter != ''){
        query = query.gte('publishDate', req.query.searchPublishedAfter)
    }
    try {
        const books = await query.exec()//when query.find({}) = query.find().exec()
        res.render('books/index', {
            books : books,
            searchOptions : req.query
        })
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
})

//get form new book
router.get('/new',  async(req, res) => {
    renderNewBook(res, new Book())//render new books
})
//creating new book
router.post('/', upload.single('cover'), async(req, res) => {//add upload file to accept file

    const fileName = req.file != null ? req.file.filename : null //filename : The name of the file within the destination
    //create new book model
    const book = new Book({
        title : req.body.title,
        author: req.body.author,
        publishDate : new Date(req.body.publishDate),//because req.body.publishDate return a string, so must be convert it
        pageCount: req.body.pageCount,
        coverImageName : fileName, 
        description : req.body.description
    })
    try {
        const newBook = await book.save() //create books
        res.redirect('/books')//redirect books
    } catch (error) {
        //console.error(error);
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewBook(res, book)//render book was exist
    }
})

//use this function for get new book route

const renderNewBook = async(res, book) => {
    try {
        //get all authors
        const authors =  await Author.find({})
        //create a new book
        //const book = new Book()
        res.render('books/new', {
            authors : authors,
            book : book
        })
    } catch (error) {
        res.redirect('/books')
    }   
}

const removeBookCover = (filename) => {
    fs.unlink(path.join(uploadPath, filename), (err) => {
        if (err) throw err;
    })
}

module.exports = router