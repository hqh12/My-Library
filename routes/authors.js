const express = require('express');
const router = express.Router();
const Author = require('../models/author')
const Book = require('../models/book')

//get all author routes
router.get('/', async(req, res) => {
    //create a search option to search
    //let searchOptions = {}
    let query = Author.find()
    if (req.query.searchAuthor !== ''){
     query = query.regex('name', new RegExp(req.query.searchAuthor, 'i'))
    }
    //check search value equal to null, if not null assign searchOptions value equal to a new regexp
    // if (req.query.searchAuthor !== ''){
    //     searchOptions.name = new RegExp(req.query.searchAuthor, 'i')
    // }
    try {
        //find all model existing
        //if searchOptions = '' => find({}),else find({name : 'fa'})
        //const authors = await Author.find(searchOptions)
        const authors = await query.exec()
        res.render('author/index', {
            authors : authors,
            searchOptions : req.query
        })
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }
})

//get form new author
router.get('/new', (req, res) => {
    res.render('author/new', {author: new Author()})
})

//creating new author
router.post('/', async(req, res) => {
    //create new author model
    const author = new Author({
        name : req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`/authors/${newAuthor.id}`)
    } catch (error) {
        error =>  console.error(error)
    }
})


//show an Author route
// WARNING : put /new before /:id, otherwise server was wrong : /:id = new
router.get('/:id', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id)//find author by id
        const books = await Book.find({author : author.id}).limit(6).exec()//find all books of author, must ve exec because no prams req
        res.render('author/show', {
            author: author,
            booksByAuthor : books
        })
    } catch (error) {
        console.error(error)
        res.redirect('/')
    }

})

//show edit author route
router.get('/:id/edit', async(req, res) => {
    try {
        const author = await Author.findById(req.params.id) // find author by id
        res.render('author/edit', {author: author}) //if exist show author
    } catch (error) {
        res.redirect('/')
    }
})

//update author 
router.put('/:id', async(req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)//check author was exist
        author.name = req.body.name //if exist, assign author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
        error =>  console.error(error)
        res.redirect('/')
    }
})
-
//delete author
router.delete('/:id', async(req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)//check author was exist
        await author.remove()//if exist, remove
        res.redirect(`/authors`)
    } catch (error) {
        error =>  console.error(error)
        res.redirect('/')
    }
})


module.exports = router