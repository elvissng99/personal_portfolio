const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

exports.about = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        console.log("home view")
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