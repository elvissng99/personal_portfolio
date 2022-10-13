const express = require("express")
const expressHandlebars = require('express-handlebars')
const mysql = require("mysql")
require("dotenv").config()
const session = require('express-session')
const {v4:uuidv4}= require('uuid')
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
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:true
}))
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});
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

const route_experience = require("./server/routes/experience")
app.use('/',route_experience)

const route_navigation = require("./server/routes/navigation")
app.use('/',route_navigation)

const route_about = require("./server/routes/about")
app.use('/',route_about)

const route_home = require("./server/routes/home")
app.use('/',route_home)

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})