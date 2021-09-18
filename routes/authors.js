const express = require('express');
const router = express.Router();
const Author = require('../models/author')

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
        res.redirect('authors')
    } catch (error) {
        error =>  console.error(error)
    }
})

module.exports = router