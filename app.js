const express = require("express")
const expressHandlebars = require('express-handlebars')
const sqlite3 = require("sqlite3")
const expressSession = require('express-session')

const ADMIN_USERNAME ="kaitao"
const ADMIN_PASSWORD = "kaitao123"

const PROJECT_TITLE_MAX_LENGTH = 50;
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
    if(!request.session.isLoggedIn){
        response.redirect("/login")
    }else{
        response.render("addProject.hbs")
    }
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
    }else if (PROJECT_DESCRIPTION_MAX_LENGTH < description.length){
        errorMessages.push("Description may be at most " +PROJECT_DESCRIPTION_MAX_LENGTH + " characters long")
    }

    //do image path checks when figured out

    if(!request.session.isLoggedIn){
        errorMessages.push("Not logged in")
    }

    if(errorMessages.length == 0){
        const query = `INSERT INTO projects (title,description,imagePath) VALUES (?,?)`
        const values = [title,description,imagePath]
        db.run(query,values,function(error){
            if(error){
                errorMessages.push("Internal server error")
                const model = {
                    errorMessages,
                    title,
                    description,
                    //also pass in image stuff if possible
                }
                response.render('addProject.hbs')
            }else{
                response.redirect("/admin")
            }
        })
    }else{
        const model = {
            errorMessages,
            title,
            description,
            //also passi n image stuff if possible
        }
        response.render("addProject.hbs",model)
    }

    response.render("addProject.hbs")
})

app.get('/project/:id',function(request,response){
    const id = request.params.id
    const query = `SELECT * from projects where id =?`
    const values = [id]

    db.get(query, values, function(error,project){
        const model = {
            project :project,
            isLoggedIn: request.session.isLoggedIn
        }
        response.render('project.hbs', model)
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
        response.redirect('/admin')
    }else{
        const model = {
            failedToLogin: true
        }
        response.render('login.hbs',model)
    }
})

app.get('/logout',function(request,response){
    request.session.destroy(function(err){
        if (err){
            throw err
        }else{
            response.redirect("/login")
        }
    })
})

app.get('/admin', function(request,response){
    if (request.session.isLoggedIn){
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
                response.render('admin.hbs',model)
            })
        })
    }else{
        response.redirect('/login')
    }
})

app.get('/resume',function (request,response){
    response.download("./public/resume_example.pdf")
}) 

app.listen(8080)