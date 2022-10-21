const session = require('express-session');
const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

const DESCRIPTION_MAX_LENGTH = 512
const SKILL_MAX_LENGTH = 128

exports.create_form = (req,res)=>{
    if (req.session.email){
        res.render("createAbout");
    }else{
        res.redirect('/login')
    }
   
}

exports.create = (req,res)=>{
    if (req.session.email){
        const{description} = req.body
        const errorMessages = []
        if (description == ""){
            errorMessages.push("Description can't be empty")
        }else if (DESCRIPTION_MAX_LENGTH < description.length){
            errorMessages.push("Description may be at most " + DESCRIPTION_MAX_LENGTH + " characters long")
        }
        if (errorMessages.length == 0){
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('INSERT INTO about SET description = ?',[description],(err, about)=>{
                    connection.release()
                    if(!err){
                        res.redirect('/about/admin')
                    }else{
                        res.render('error')
                    }
                })
            })
        }else{
            res.render('createAbout',{description, errorMessages})
        }
    }else{
        res.redirect('/login')
    }
    

}

exports.update_form = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM about WHERE id = ?;',[req.params.id],(err, about)=>{
                connection.release()
                if(!err){
                    res.render('updateAbout',about[0])
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
        const{description} = req.body
        const errorMessages = []
        if (description == ""){
            errorMessages.push("Description can't be empty")
        }else if (DESCRIPTION_MAX_LENGTH < description.length){
            errorMessages.push("Description may be at most " + DESCRIPTION_MAX_LENGTH + " characters long")
        }
        if(errorMessages.length == 0){
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('UPDATE about SET description = ? WHERE id = ?',[description,req.params.id],(err, about)=>{
                    connection.release()
                    if(!err){
                        res.render('updateAbout',{
                            id: req.params.id,
                            description,
                            isSuccessful:true
                        })
                    }else{
                        res.render('error')
                    }
                })
            })
        }else{
            res.render('updateAbout',{
                id: req.params.id,
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
            connection.query('DELETE FROM about WHERE id = ?;',[req.params.id],(err, about)=>{
                connection.release()
                if(!err){
                    res.redirect('/about/admin')
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}

exports.createSkill= (req,res)=>{
    if (req.session.email){
        const{skill} = req.body
        const errorMessages = []
        if (skill == ""){
            errorMessages.push("Skill can't be empty")
        }else if (SKILL_MAX_LENGTH < skill.length){
            errorMessages.push("Skill may be at most " + SKILL_MAX_LENGTH + " characters long")
        }
        if(errorMessages.length == 0){
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('INSERT INTO skills SET name = ?',[skill],(err, skills)=>{
                    connection.release()
                    if(!err){
                        res.redirect('/about/admin')
                    }else{
                        console.log(err.message)
                        res.render('error')
                    }
                })
            })
        }else{
            pool.getConnection((err,connection)=>{
                if(err) res.render('error')
                console.log("Connected as ID" + connection.threadId)
                connection.query('SELECT * FROM about;',(err, about)=>{
                    if(!err){
                        connection.query('SELECT * FROM skills;',(err, skills)=>{
                            connection.release()
                            if(!err){
                                res.render('aboutAdmin',{about, skills,skill,errorMessages})
                            }else{
                                res.render('error')
                            }
                        })
                    }else{
                        res.render('error')
                    }
                })
            })
        }
        
    }else{
        res.redirect('/login')
    }
}

exports.deleteSkill = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('DELETE FROM skills WHERE id = ?;',[req.params.id],(err, skills)=>{
                connection.release()
                if(!err){
                    res.redirect('/about/admin')
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}