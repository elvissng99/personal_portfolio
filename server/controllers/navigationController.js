const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

exports.home = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        console.log("home view")
        connection.query('SELECT * FROM experiences;',(err, experiences)=>{
            if(!err){
                connection.query('SELECT * FROM home;',(err, home)=>{
                    connection.release()
                    if(!err){
                        res.render('home',{
                            experiences: experiences,
                            home: home
                        })
                    }else{
                        throw err
                    }
                    
                })
                
            }else{
                throw err
            }
        })
    })
}


exports.resume = (req,res)=>{
    res.download("./public/resume_example.pdf")
}