const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})



exports.view = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('SELECT * FROM experiences;',(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('admin',{experiences})
            }else{
                console.log(err)
            }
        })
    })
    
}

exports.form = (req,res)=>{
    res.render("addExperience");
}

exports.create = (req,res)=>{
    console.log(req.body)
    const{title,description} = req.body

    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('INSERT INTO experiences SET title = ?, description = ?',[title,description],(err, experiences)=>{
            if(!err){
                connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                    connection.release()
                    if(!err){
                        res.render('admin',{experiences})
                    }else{
                        console.log(err)
                    }
                })
            }else{
                console.log(err)
            }
        })
    })

}

exports.edit = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('editExperience',{experiences})
            }else{
                console.log(err)
            }
        })
    })
}