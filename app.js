const express = require("express")
const expressHandlebars = require('express-handlebars')
const app = express()
app.engine('hbs',expressHandlebars.engine({
    extname:".hbs",
}))
app.use(express.static("public"))
const data = {
    experiences: [
        {
            id:0,
            title:"Company 1",
            description:"work in company 1",
        },
        {
            id:1,
            title:"Company 2",
            description:"work in company 2",
        },
        {
            id:2,
            title:"Company 3",
            description:"work in company 3",
        }
    ]
}

app.get('/', (req,res)=>{
    const context = data
    res.render('main.hbs',context)
})

app.get('/admin', (req,res)=>{
    const context = data
    context["layout"] = 'main'
    res.render('admin.hbs',context)
})

app.get('/login', (req,res)=>{
    const context = data
    res.render('login.hbs',context)
})

app.listen(3000)