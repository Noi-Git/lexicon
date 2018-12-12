const express   = require('express')
const exphbs    = require('express-handlebars')

const app = express()

// handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

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



const port = 5000
app.listen(port, () => {
    console.log(`Sever started on ${port}`)
})