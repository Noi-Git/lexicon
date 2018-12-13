const express       = require('express')
const exphbs        = require('express-handlebars')
const bodyParser    = require('body-parser')
const mongoose      = require('mongoose')

const app = express()

// map global promise -- to get rid of DeprecationWarning
mongoose.Promise = global.Promise
// connect to mongoose
mongoose.connect('mongodb://localhost/lexidb', {
    useMongoClient: true
})
//use promise with .then
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))
// load Idea model from Idea.js
require('./models/Idea')
const Idea = mongoose.model('ideas')

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//==========================

// index route
app.get('/', (req, res) => {
    const title = 'Welcome to Lexicon'
    res.render('index', {
        title: title
    })
})

//about route
app.get('/about', (req, res) => {
    res.render('about')
})

//idea index page
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            })
        })
})

//===========================
//add idea form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add')
})

//edit idea form -- use id of each post
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        })
    })
})

//=============================
//process form
app.post('/ideas', (req, res) => {
    //set server validation
    let errors = []

    if(!req.body.title) {
        errors.push({text: 'Please add a title'})
    }
    if(!req.body.details) {
        errors.push({text: 'Please add some details'})
    }

    if(errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas')
            })
    }
})


//=============================
const port = 5000
app.listen(port, () => {
    console.log(`Sever started on ${port}`)
})