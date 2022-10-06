const mysql = require('mysql')
const bcrypt = require("bcrypt");

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
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM home;',(err, home)=>{
            connection.release()
            if(!err){
                res.render('home',{
                    home: home
                })
            }else{
                throw err
            }
            
        })
    })
}

exports.about = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM about;',(err, about)=>{
            if(!err){
                connection.release()
                res.render('about',{about})
            }else{
                throw err
            }
        })
    })
}

exports.experiences = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM experiences;',(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('experiences',{
                    experiences: experiences,
                })
            }else{
                throw err
            }
        })
    })
}

exports.contact = (req,res)=>{
    res.render('contact')
}

exports.login = (req,res)=>{
    const error = req.query.error;
    if (error == 1){
        res.render("login",{error:error})
    }else{
        res.render("login")
    }
    
    
}

exports.validate = (req,res)=>{
    const{email,password} = req.body
    if (email == "email@mail.com"){
        bcrypt.compare(password, ADMIN_PASSWORD, function(err, result) {
            if (result == true){
                req.session.email = email
                res.redirect('/')
            }else{
                res.redirect('/login/?error=1');
            }
        })
    }else{
        res.redirect('/login/?error=1');
    }    
}

exports.logout = (req,res)=>{
    req.session.destroy(function(err){
        if (err){
            throw err
        }else{
            res.redirect("/login")
        }
    })   
}

exports.experiences_admin = (req,res)=>{
    console.log("vfajlsfngvaeknf")
    if (req.session.email){
        console.log("hello")
        pool.getConnection((err,connection)=>{
            if(err) throw err
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                connection.release()
                if(!err){
                    console.log(experiences)
                    res.render('experiences_admin',{experiences})
                }else{
                    throw err
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
            if(err) throw err
            console.log("Connected as ID" + connection.threadId)
            connection.query('SELECT * FROM about;',(err, about)=>{
                connection.release()
                if(!err){
                    res.render('about_admin',{about})
                }else{
                    throw err
                }
            })
        })
    }else{
        res.redirect('/login')
    }
}