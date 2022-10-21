const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

const INTRODUCTION_MAX_LENGTH =64
const NAME_MAX_LENGTH = 64
const EMPLOYMENT_MAX_LENGTH = 128
const DESCRIPTION_MAX_LENGTH = 128

exports.update = (req,res)=>{
    if (req.session.email){
        const{introduction,name,employment,description} = req.body
        const errorMessages = []

        if (introduction == ""){
            errorMessages.push("Introduction can't be empty")
        }else if (INTRODUCTION_MAX_LENGTH < introduction.length){
            errorMessages.push("Introduction may be at most " + INTRODUCTION_MAX_LENGTH + " characters long")
        }

        if (name == ""){
            errorMessages.push("Name can't be empty")
        }else if (NAME_MAX_LENGTH < name.length){
            errorMessages.push("Name may be at most " + NAME_MAX_LENGTH + " characters long")
        }

        if (employment == ""){
            errorMessages.push("Employment can't be empty")
        }else if (EMPLOYMENT_MAX_LENGTH < employment.length){
            errorMessages.push("Employment may be at most " + EMPLOYMENT_MAX_LENGTH + " characters long")
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
                connection.query('UPDATE home SET introduction = ?, name = ?, employment = ?, description = ? WHERE id = 1',[introduction,name,employment,description],(err, home)=>{
                    if(!err){
                        connection.query('SELECT * FROM home;',(err, home)=>{
                            connection.release()
                            if(!err){
                                res.render('homeAdmin',{home, isSuccessful:true})
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
            res.render('homeAdmin',{
                home:[{
                    introduction,
                    name,
                    employment,
                    description
                }],
                errorMessages
            })
        }
        
    }else{
        res.redirect('/login')
    }
}