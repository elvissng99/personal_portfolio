const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})



exports.admin = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        console.log("admin view")
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
    console.log("add experience")
    res.render("addExperience");
}

exports.create = (req,res)=>{
    console.log("adding experience")
    const{title,description} = req.body

    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('INSERT INTO experiences SET title = ?, description = ?',[title,description],(err, experiences)=>{
            if(!err){
                console.log("added experience")
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
    console.log("edit experience")
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

exports.update = (req,res)=>{
    
    const{title,description} = req.body
    console.log("editing experience")
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('UPDATE experiences SET title = ?, description = ? WHERE id = ?',[title,description,req.params.id],(err, experiences)=>{
            if(!err){
                console.log("edited experience")
                connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
                    connection.release()
                    if(!err){
                        res.render('editExperience',{experiences})
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

exports.view = (req,res)=>{
    console.log("view experience")
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('SELECT * FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
            connection.release()
            if(!err){
                res.render('viewExperience',{experiences})
            }else{
                console.log(err)
            }
        })
    })
}

exports.delete = (req,res)=>{
    console.log("delete experience")
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('DELETE FROM experiences WHERE id = ?;',[req.params.id],(err, experiences)=>{
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