const express = require("express")
const expressHandlebars = require('express-handlebars')
const sqlite3 = require("sqlite3")
const expressSession = require('express-session')

const ADMIN_USERNAME ="kaitao@gmail.com"
const ADMIN_PASSWORD = "kaitao123"

const PROJECT_TITLE_MAX_LENGTH = 50;
const PROJECT_DESCRIPTION_MAX_LENGTH = 500
const IMAGE_PATH_MAX_LENGTH = 100

const db = new sqlite3.Database("database.db")
db.run(`
	CREATE TABLE IF NOT EXISTS home (
		id INTEGER PRIMARY KEY,
		title TEXT,
        occupation TEXT
		description TEXT
	);

    CREATE TABLE IF NOT EXISTS about (
		id INTEGER PRIMARY KEY,
		description TEXT,
	);

    CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		title TEXT,
		description TEXT,
        imagePath TEXT
	);
`)
// const {v4:uuidv4}= require('uuid')
const app = express()
const port = 5000
app.engine('hbs', expressHandlebars.engine({
	defaultLayout: 'main.hbs',
}))
// app.engine('hbs',expressHandlebars.engine({
//     extname:".hbs",
// }))
// app.set('view engine', 'hbs')
app.use(express.static("public"))
app.use(express.urlencoded({
    extended:false
}))

// app.use(express.json())
// app.use(session({
//     secret:uuidv4(),
//     resave:false,
//     saveUninitialized:true
// }))
app.use(session({
    secret:'sfgertjhsgwrsgethgw',
    resave:false,
    saveUninitialized:true
}))

app.get('/', function(request,response){
    const query = `SELECT * FROM home`
    db.all(query,function(error,about){
        const errorMessages = []
        if(error){
            errorMessages.push("Internal server error")
        }
        const query2 = `SELECT * FROM projects`
        db.all(query2,function(error,projects){
            const errorMessages = []
            if(error){
                errorMessages.push("Internal server error")
            }
             
            const model = {
                session:request.session,
                errorMessages,
                about,
                projects
            }
            response.render('home.hbs',model)
        })
    })

})

app.get('/about', function(request,response){
    const query = `SELECT * FROM about`
    db.all(query,function(error,about){
        const errorMessages = []
        if(error){
            errorMessages.push("Internal server error")
        }

        const model = {
            errorMessages,
            about
        }
        response.render('about.hbs',model)
    })
})

app.get('/addProject', function(request,response){
    response.render("addProject.hbs")
})

app.post('/addProject', function(request,response){
    const title = request.body.title
    const description = request.body.description
    //currently it is fixed for now
    const imagePath = "/image1.png"

    const errorMessages = []

    if (title == ""){
        errorMessages.push("Title can't be empty")
    }else if (PROJECT_TITLE_MAX_LENGTH < title.length){
        errorMessages.push("Title may be at most " +PROJECT_TITLE_MAX_LENGTH + " characters long")
    }

    if (description ==""){
        errorMessages.push("Description should not be empty")
    }
    response.render("addProject.hbs")
})

// const pool = mysql.createPool({
//     connectionLimit : 100,
//     host: process.env.DB_HOST,
//     user : process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME
// })

// pool.getConnection((err,connection)=>{
//     if(err) throw err
//     console.log("Connected as ID" + connection.threadId)
// })

// const route_experience = require("./server/routes/experience")
// app.use('/',route_experience)

// const route_navigation = require("./server/routes/navigation")
// app.use('/',route_navigation)

// const route_about = require("./server/routes/about")
// app.use('/',route_about)

// app.get('/', (req,res)=>{
//     const context = data
//     res.render('main',context)
// })

// app.get('/admin', (req,res)=>{
//     const context = data
//     res.render('admin',context)
// })

// app.get('/login', (req,res)=>{
//     const context = data
//     res.render('login',context)
// })

// app.get('/experiences', (req,res)=>{
//     const context = data
//     res.render('experiences',context)
// })

// app.get('/contact', (req,res)=>{
//     const context = data
//     res.render('contact',context)
// })

// app.get('/about', (req,res)=>{
//     const context = data
//     res.render('about',context)
// })

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})