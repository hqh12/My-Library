const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');//get expressLayout to project 
const path = require('path');//declare path library
const indexRouter = require('./routes/index');//declare router index.js 
const authorRouter = require('./routes/authors')//declare router authors.js
const bookRouter = require('./routes/books')//declare router books.js
const mongoose = require('mongoose');
const methodOverride = require('method-override');//declare method override
require('dotenv').config();//declare dotenv


//setup value
app.set('view engine', 'ejs')//use EJS template
app.set('views', __dirname + '/views') //use all views follow __dirname/views/name_view.ejs
app.set('layout', 'layouts/layout') // set layouts/layout as body section

//middleware
app.use(methodOverride('_method'))//using this to put and delete
app.use(express.urlencoded({extended: false}))//convert query string to URL Encoded(when :'false')
app.use(expressLayouts)//using express layout (no node to declare <!DOCTyPE> with every single ejs file)
app.use(express.static(path.join(__dirname,'public')))//using public static like : css, js, images
app.use('/', indexRouter)//using index.js router
app.use('/authors', authorRouter)//using index.js router
app.use('/books', bookRouter)//using book router
//connect to mongodb
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('Connected'))
.catch(error => console.error(error))
//define a connection
// const db = mongoose.connection//create a connection

// db.on('error', error => console.error(error))
// db.once('open', () => console.log('Connected'))

app.listen(5000, () => {
    console.log('server is running at port 5000');
})