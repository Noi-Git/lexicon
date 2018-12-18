const express           = require('express')
const path              = require('path')
const exphbs            = require('express-handlebars')
const methodOverride    = require('method-override')
const flash             = require('connect-flash')
const session           = require('express-session')
const bodyParser        = require('body-parser')
const passport          = require('passport')
const mongoose          = require('mongoose')

const app = express()

// load route
const ideas = require('./routes/ideas')
const users = require('./routes/users')

// passport config
require('./config/passport') (passport)

//DB Config
const db = require('./config/database')

// map global promise -- to get rid of DeprecationWarning
mongoose.Promise = global.Promise
// connect to mongoose
mongoose.connect(db.mongoURI, {
    //useMongoClient: true //no longer necessary
})
    //use promise with .then
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))



// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

//express-session middleware and flash
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }))

  // passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// Golbal variable
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null //to hide the loging and register when user is in the login account
    next()
})

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


//=========== use route =================
app.use('/ideas', ideas)
app.use('/users', users)

//=============================
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Sever started on ${port}`)
})