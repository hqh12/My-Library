const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');//get expressLayout to project 
const path = require('path');//declare path library
const indexRouter = require('./routes/index');//declare router index.js 
const mongoose = require('mongoose');
require('dotenv').config();//declare dotenv


//setup value
app.set('view engine', 'ejs')//use EJS template
app.set('views', __dirname + '/views') //use all views follow __dirname/views/name_view.ejs
app.set('layout', 'layouts/layout') // set layouts/layout as body section

//middleware
app.use(expressLayouts)//using express layout
app.use(express.static(path.join(__dirname,'public')))//using public static like : css, js, images
app.use('/', indexRouter)//using index.js router

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