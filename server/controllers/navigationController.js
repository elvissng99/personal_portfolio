const mysql = require('mysql')
const bcrypt = require("bcrypt");
const { response } = require('express');

const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})
ADMIN_PASSWORD = '$2b$10$q2BLb2IB7TiKiEPuPrTqT.JCO/aWovTSc.qXcL21C5HeTxYgPdhdW'

exports.home = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) res.render('error')
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM home;',(err, home)=>{
            connection.release()
            if(!err){
                res.render('home',{
                    home: home
                })
            }else{
                res.render('error')
            }
            
        })
    })
}

exports.about = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) res.render('error')
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM about;',(err, about)=>{
            if(!err){
                connection.query('SELECT * FROM skills;',(err, skills)=>{
                    connection.release()
                    if(!err){
                        res.render('about',{about, skills})
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

exports.experiences = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) res.render('error')
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM experiences;',(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('experiences',{
                    experiences: experiences,
                })
            }else{
                res.render('error')
            }
        })
    })
}

exports.contact = (req,res)=>{
    res.render('contact')
}

exports.login = (req,res)=>{
    res.render("login")
}

exports.validate = (req,res)=>{
    const{email,password} = req.body
    if (email == "email@mail.com"){
        bcrypt.compare(password, ADMIN_PASSWORD, function(err, result) {
            if (result == true){
                req.session.email = email
                res.redirect('/admin')
            }else{
                res.render('login',{
                    error: "Invalid email and/or password"
                })
            }
        })
    }else{
        res.render('login',{
            error: "Invalid email and/or password"
        })
    }    
}

exports.logout = (req,res)=>{
    if (req.session.email){
        req.session.destroy(function(err){
            if (err){
                res.render('error')
            }
        })  
    }
    res.redirect("/")
}

exports.home_admin = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM home;',(err, home)=>{
                connection.release()
                if(!err){
                    res.render('homeAdmin',{home})
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}

exports.experiences_admin = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                connection.release()
                if(!err){
                    res.render('experiencesAdmin',{experiences})
                }else{
                    res.render('error')
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}

exports.about_admin = (req,res)=>{
    if (req.session.email){
        pool.getConnection((err,connection)=>{
            if(err) res.render('error')
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM about;',(err, about)=>{
                if(!err){
                    connection.query('SELECT * FROM skills;',(err, skills)=>{
                        connection.release()
                        if(!err){
                            res.render('aboutAdmin',{about, skills})
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