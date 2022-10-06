const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

exports.create_form = (req,res)=>{
    res.render("createExperience");
}

exports.create = (req,res)=>{
    const{title,description} = req.body

    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('INSERT INTO experiences SET title = ?, description = ?',[title,description],(err, experiences)=>{
            if(!err){
                connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                    connection.release()
                    if(!err){
                        res.render('experiences_admin',{experiences})
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

exports.read = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('readExperience',{experiences})
            }else{
                throw err
            }
        })
    })
}

exports.update_form = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('updateExperience',{experiences})
            }else{
                throw err
            }
        })
    })
}

exports.update = (req,res)=>{
    
    const{title,description} = req.body
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('UPDATE experiences SET title = ?, description = ? WHERE id = ?',[title,description,req.params.id],(err, experiences)=>{
            if(!err){
                connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                    connection.release()
                    if(!err){
                        res.render('updateExperience',{experiences})
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

exports.delete = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('DELETE FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
            if(!err){
                connection.query('SELECT * FROM experiences;',(err, experiences)=>{
                    connection.release()
                    if(!err){
                        res.render('experiences_admin',{experiences})
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