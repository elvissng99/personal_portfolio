const mysql = require('mysql')
const pool = mysql.createPool({
    connectionLimit : 100,
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

exports.create_form = (req,res)=>{
    res.render("createAbout");
}

exports.create = (req,res)=>{
    const{description} = req.body

    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('INSERT INTO about SET description = ?',[description],(err, about)=>{
            if(!err){
                connection.query('SELECT * FROM about;',(err, about)=>{
                    connection.release()
                    if(!err){
                        res.render('about_admin',{about})
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

exports.update_form = (req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('SELECT * FROM about WHERE id = ?;',[req.params.id],(err, about)=>{
            connection.release()
            if(!err){
                res.render('updateAbout',{about})
            }else{
                throw err
            }
        })
    })
}

exports.update = (req,res)=>{
    
    const{description} = req.body
    pool.getConnection((err,connection)=>{
        if(err) throw err
        console.log("Connected as ID" + connection.threadId)
        
        connection.query('UPDATE about SET description = ? WHERE id = ?',[description,req.params.id],(err, about)=>{
            if(!err){
                connection.query('SELECT * FROM about WHERE id = ?;',[req.params.id],(err, about)=>{
                    connection.release()
                    if(!err){
                        res.render('updateAbout',{about})
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
        
        connection.query('DELETE FROM about WHERE id = ?;',[req.params.id],(err, about)=>{
            if(!err){
                connection.query('SELECT * FROM about;',(err, about)=>{
                    connection.release()
                    if(!err){
                        res.render('about_admin',{about})
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