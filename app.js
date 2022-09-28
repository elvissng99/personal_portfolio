const express = require("express")
const expressHandlebars = require('express-handlebars')
const sqlite3 = require("sqlite3")
const expressSession = require('express-session')
const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: "./public/",
    filename: function(request,file,callback){
        if (file!=undefined){
            const currentDate = Date.now()
            request.body.imagePath = "/" + currentDate + path.extname(file.originalname)
            callback(null,currentDate + path.extname(file.originalname))
        }
    }
})

const upload = multer({
    storage:storage,    
}).single('imagePath')

const ADMIN_USERNAME ="kaitao"
const ADMIN_PASSWORD = "kaitao123"

const TITLE_MAX_LENGTH = 50;
const ABOUT_DESCRIPTION_MAX_LENGTH = 2000;
const PROJECT_DESCRIPTION_MAX_LENGTH = 500
const IMAGE_PATH_MAX_LENGTH = 100

const db = new sqlite3.Database("database.db")
db.run(`
	CREATE TABLE IF NOT EXISTS home (
		id INTEGER PRIMARY KEY,
		title TEXT,
        occupation TEXT,
		description TEXT
	);
`)

db.run(`
    CREATE TABLE IF NOT EXISTS about (
		id INTEGER PRIMARY KEY,
        title TEXT,
		description TEXT
	);
`)

db.run(`
    CREATE TABLE IF NOT EXISTS projects (
		id INTEGER PRIMARY KEY,
		title TEXT,
		description TEXT,
        imagePath TEXT
	);
`)
// const {v4:uuidv4}= require('uuid')
const app = express()
const port = 8080
app.engine('hbs',expressHandlebars.engine({
    defaultLayout: 'main.hbs',
    extname:".hbs",
}))
// app.set('view engine', 'hbs')
app.use(express.static("public"))
app.use(express.urlencoded({
    extended:false
}))
app.use(express.json());

// app.use(express.json())
// app.use(expressSession({
//     secret:uuidv4(),
//     resave:false,
//     saveUninitialized:true
// }))
app.use(expressSession({
    secret:'sfgertjhsgwrsgethgw',
    resave:false,
    saveUninitialized:true
}))

app.get('/', function(request,response){
    const query = `SELECT * FROM home`
    db.get(query,function(error,home){
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
                home,
                projects
            }
            response.render('home.hbs',model)
        })
    })

})

app.get('/about', function(request,response){
    const query = `SELECT * FROM about`
    db.get(query,function(error,about){
        const errorMessages = []
        if(error){
            errorMessages.push("Internal server error")
        }
        const model = {
            errorMessages,
            about,
            session:request.session,

        }
        response.render('about.hbs',model)
    })
})

app.post('/about',function(request,response){
    const title = request.body.title
    const description = request.body.description
    let successful = false
    const errorMessages = []

    if (title == ""){
        errorMessages.push("Title can't be empty")
    }else if (TITLE_MAX_LENGTH < title.length){
        errorMessages.push("Title may be at most " +TITLE_MAX_LENGTH + " characters long")
    }

    if (description ==""){
        errorMessages.push("Description should not be empty")
    }else if (ABOUT_DESCRIPTION_MAX_LENGTH < description.length){
        errorMessages.push("Description may be at most " +ABOUT_DESCRIPTION_MAX_LENGTH + " characters long")
    }

    if(!request.session.isLoggedIn){
        errorMessages.push("Not logged in")
    }

    if(errorMessages.length == 0){
        const query = `UPDATE about SET title = ?, description = ? WHERE id = 1`
        const values = [title,description]
        db.run(query,values,function(error){
            if(error){
                errorMessages.push("Internal server error")
            }
        })
    }
    if(errorMessages.length == 0) successful = true
    const model = {
        errorMessages,
        successful,
        session:request.session,
        about:{
            title:title,
            description:description}
    }
    response.render('about.hbs', model)
})

app.get('/addProject', function(request,response){
    if(!request.session.isLoggedIn){
        response.redirect("/login")
    }else{
        response.render("addProject.hbs")
    }
})

app.post('/addProject', upload, function(request,response){
    const title = request.body.title
    const description = request.body.description
    const imagePath = request.body.imagePath

    const errorMessages = []
    if (title == ""){
        errorMessages.push("Title can't be empty")
    }else if (TITLE_MAX_LENGTH < title.length){
        errorMessages.push("Title may be at most " +TITLE_MAX_LENGTH + " characters long")
    }

    if (description ==""){
        errorMessages.push("Description should not be empty")
    }else if (PROJECT_DESCRIPTION_MAX_LENGTH < description.length){
        errorMessages.push("Description may be at most " +PROJECT_DESCRIPTION_MAX_LENGTH + " characters long")
    }

    if(!request.session.isLoggedIn){
        errorMessages.push("Not logged in")
    }

    if(imagePath == undefined){
        errorMessages.push("Please attach a file")
    }

    if(errorMessages.length == 0){
        const query = `INSERT INTO projects (title,description,imagePath) VALUES (?,?,?)`
        const values = [title,description,imagePath]
        db.run(query,values,function(error){
            if(error){
                errorMessages.push("Internal server error")
                const model = {
                    errorMessages,
                    project:{
                        title:title,
                        description:description,
                        imagePath:imagePath                    }
                }
                response.render('addProject.hbs', model)
            }else{
                response.redirect("/")
            }
        })
    }else{
        const model = {
            errorMessages,
            project:{
                title:title,
                description:description,
                imagePath:imagePath            }
            
        }
        response.render("addProject.hbs",model)
    }
})

app.get('/project/:id',function(request,response){
    const id = request.params.id
    const query = `SELECT * from projects where id =?`
    const values = [id]

    db.get(query, values, function(error,project){
        const model = {
            project :project,
            session:request.session,
        }
        response.render('project.hbs', model)
    })
})

app.get('/editProject/:id',function(request,response){
    const id = request.params.id
    const query = `SELECT * from projects where id =?`
    const values = [id]
    db.get(query, values, function(error,project){
        const model = {
            id,
            project :project,
            session:request.session,
        }
        response.render('editProject.hbs', model)
    })
})

app.post('/editProject/:id',upload,function(request,response){
    const title = request.body.title
    const description = request.body.description
    const imagePath = request.body.imagePath

    const errorMessages = []
    if (title == ""){
        errorMessages.push("Title can't be empty")
    }else if (TITLE_MAX_LENGTH < title.length){
        errorMessages.push("Title may be at most " +TITLE_MAX_LENGTH + " characters long")
    }

    if (description ==""){
        errorMessages.push("Description should not be empty")
    }else if (PROJECT_DESCRIPTION_MAX_LENGTH < description.length){
        errorMessages.push("Description may be at most " +PROJECT_DESCRIPTION_MAX_LENGTH + " characters long")
    }

    if(!request.session.isLoggedIn){
        errorMessages.push("Not logged in")
    }

    if(errorMessages.length == 0){
        let query
        let values
        if (imagePath== undefined){
            query = `UPDATE projects SET title = ?, description = ? WHERE id = ?`
            values = [title,description, request.params.id]
        }else{
            query = `UPDATE projects SET title = ?, description = ?, imagePath = ? WHERE id = ?`
            values = [title,description,imagePath, request.params.id]
        }
        
        db.run(query,values,function(error){
            if(error){
                errorMessages.push("Internal server error")
                const model = {
                    errorMessages,
                    project:{
                        title:title,
                        description:description,
                        imagePath:imagePath
                    }
                }
                response.render('editProject.hbs', model)
            }else{
                response.redirect("/")
            }
        })
    }else{
        const model = {
            errorMessages,
            project:{
                title:title,
                description:description,
                imagePath:imagePath
            }
            
        }
        response.render("editProject.hbs",model)
    }
})

app.get('/deleteProject/:id',function(request,response){
    const id = request.params.id
    response.render("deleteProject.hbs",{id})
})

app.post('/deleteProject/:id', function(request,response){
    const id = request.params.id
    const query = `DELETE FROM projects WHERE id =?`
    const values = [id]
    db.run(query, values,function(error){
        if (error){
            const errorMessages = []
            errorMessages.push("Internal Server Error")
            response.render("deleteProject.hbs",{errorMessages})
        }else{
            const model = {
                id,
                session:request.session,
            }
            response.redirect('/')
        }
        
    })
})

app.get('/login', function(request,response){
    response.render('login.hbs')
})

app.post('/login', function(request,response){
    const username = request.body.username
    const password = request.body.password
    if(username == ADMIN_USERNAME && password == ADMIN_PASSWORD){
        request.session.isLoggedIn = true
        response.redirect('/')
    }else{
        const model = {
            failedToLogin: true
        }
        response.render('login.hbs',model)
    }
})

app.get('/logout',function(request,response){
    request.session.destroy(function(error){
        if (error){
            response.redirect("/")
        }else{
            response.redirect("/login")
        }
    })
})

app.get('/resume',function (request,response){
    response.download("./public/resume_example.pdf")
}) 

app.listen(8080)