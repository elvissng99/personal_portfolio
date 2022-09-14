const express = require("express")
const expressHandlebars = require('express-handlebars')
const mysql = require("mysql")
require("dotenv").config()
const app = express()
const port = 5000
app.engine('hbs',expressHandlebars.engine({
    extname:".hbs",
}))
app.set('view engine', 'hbs')
app.use(express.static("public"))
app.use(express.urlencoded({
    extended:false
}))

app.use(express.json())

const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

pool.getConnection((err,connection)=>{
    if(err) throw err
    console.log("Connected as ID" + connection.threadId)
})

const routes = require("./server/routes/experience")
app.use('/',routes)

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