const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

const TITLE_MAX_LENGTH = 128
const DESCRIPTION_MAX_LENGTH = 1000

exports.create_form = (req,res)=>{
    if (req.session.email){
        res.render("createExperience");
    }else{
        res.redirect('/login')
    }
}

exports.create = (req,res)=>{
    if (req.session.email){
        const{title,description} = req.body
        const errorMessages = []
        if (title == ""){
            errorMessages.push("Title can't be empty")
        }else if (TITLE_MAX_LENGTH < title.length){
            errorMessages.push("Title may be at most " + TITLE_MAX_LENGTH + " characters long")
        }

        if (description == ""){
            errorMessages.push("Description can't be empty")
        }else if (DESCRIPTION_MAX_LENGTH < description.length){
            errorMessages.push("Description may be at most " + DESCRIPTION_MAX_LENGTH + " characters long")
        }
        if (errorMessages.length ==0){
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('INSERT INTO experiences SET title = ?, description = ?',[title,description],(err, experiences)=>{
                    if(!err){
                        connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                            connection.release()
                            if(!err){
                                res.render('experiences_admin',{experiences})
                            }else{
                                res.render('error')
                            }
                        })
                    }else{
                        res.render('error')
                    }
                })
            })
        }else{
            res.render('createExperience',{
                title,
                description,
                errorMessages
            })
        }
        
    }else{
        res.redirect('/login')
    }
}

exports.read = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                connection.release()
                if(!err){
                    res.render('readExperience',{experiences})
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}

exports.update_form = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                connection.release()
                if(!err){
                    res.render('updateExperience',experiences[0])
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}

exports.update = (req,res)=>{
    if (req.session.email){
        const{title,description} = req.body
        const errorMessages = []
        if (title == ""){
            errorMessages.push("Title can't be empty")
        }else if (TITLE_MAX_LENGTH < title.length){
            errorMessages.push("Title may be at most " + TITLE_MAX_LENGTH + " characters long")
        }

        if (description == ""){
            errorMessages.push("Description can't be empty")
        }else if (DESCRIPTION_MAX_LENGTH < description.length){
            errorMessages.push("Description may be at most " + DESCRIPTION_MAX_LENGTH + " characters long")
        }

        if(errorMessages.length == 0){
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('UPDATE experiences SET title = ?, description = ? WHERE id = ?',[title,description,req.params.id],(err, experiences)=>{
                    if(!err){
                        connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                            connection.release()
                            if(!err){
                                res.render('updateExperience',experiences[0])
                            }else{
                                res.render('error')
                            }
                        })
                    }else{
                        res.render('error')
                    }
                })
            })
        }else{
            res.render('updateExperience',{
                id: req.params.id,
                title,
                description,
                errorMessages
            })
        }
        
    }else{
        res.redirect('/login')
    }
}

exports.delete = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('DELETE FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                if(!err){
                    connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                        connection.release()
                        if(!err){
                            res.render('experiences_admin',{experiences})
                        }else{
                            res.render('error')
                        }
                    })
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}