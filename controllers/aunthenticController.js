const jwt = require ('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const connection = require('../database/database')
const {promisify} = require('util');
const { json } = require('express');


//registration
exports.regi = async (req,res)=>{

    try {
      const data= req.body;
    
    const user= data.username;
    const pass= data.password;
    const genero= data.gen;
    const direccion= data.direc;
    const correo= data.ema;
    const numero= data.num;
    const nombre= data.nombre;
    
  
    let passwordHaash = await bcryptjs.hash(pass,8);
    const passw=passwordHaash;
    
   connection.query('INSERT INTO usuario SET ?', {Nombre:nombre,user:user, pass:passw,correo:correo, direccion:direccion,  numero:numero, genero:genero,rol:0}, async(error,results)=>{
    if(error){
      res.send(error);
    }else{
      res.render("checkout");
     }
  })
    } catch (error) {
      console.log(error);
      res.render('checkout',{
        idUser:idUser
      })
    }
    
    
  };
  
  //Login
  exports.logins = async(req,res)=>{
  
    try {
      const data= req.body;
    
    const user= data.username;
    const pass= data.password;
  
    let passwordHaash = await bcryptjs.hash(pass,8);
    const passw=passwordHaash;
  
    if(!user || !pass){
      res.render('login',{
        alert:true,
        alertTitle: "Advertencia",
        alertMessage: "Ingrese un usuario y password",
        alertIcon:'info',
        showConfirmButton: true,
        timer: false,
        ruta: 'login'
    })
    }else{
    
    if(user && pass){
      connection.query('SELECT * FROM usuario WHERE user= ?', [user], async (error,results)=>{
        if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
          res.render('login',{
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o Password incorrectas",
            alertIcon:'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login' 
        })
        }else{
      
          
          const idUser= results[0].idUser
        
  
          const token = jwt.sign({id:idUser}, process.env.JWT_SECRETO, {
              expiresIn: process.env.JWT_TIEMPO_EXPIRA
          })
          console.log("TOKEN: "+token+" para el USUARIO : "+user)
         
  
          const cookiesOptions ={
            expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          
            res.cookie('jwt', token, cookiesOptions)
            
            connection.query("SELECT usuario.nombre, COUNT(usuario.idUser) AS 'Activos',pedidos.idPedido, COUNT(pedidos.idPedido) AS 'pedidosact', SUM(pedidos.precioU) as 'totales', pedidos.estado FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser ORDER BY usuario.idUser DESC",async (error,results)=>{
              if(error){
                console.log(error)
              }else{
                res.render('admin',{
                  data: results
                
                })
              
              }
            })
            
       
        
        }
      })
    }
      
  }} catch (error) {
      throw error;
      console.log(error);
      
      
    }
  
    
  
  }
  
  exports.logout = async(req, res)=>{
    res.clearCookie('jwt')
    return res.redirect('/login')
  }

  //muestra pedidos
  function load(req,res){
    req.getConnection((err,conn))
  }

  exports.listaPedido = (req,res) =>{
    connection.query("SELECT Nombre, correo, numero, direccion, idPedido, nombreProducto, tallaProducto, colorProducto, cantidad, precioU, link FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser AND pedidos.estado = 'activo' ORDER BY usuario.idUser DESC",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('orders.ejs',{
          data: results
        
        })
      
      }
    })

  }

  exports.listaUsuario = (req,res) =>{
    connection.query("SELECT * FROM usuario ORDER BY usuario.idUser DESC",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('admin-users.ejs',{
          data: results
        
        })
      
      }
    })

  }

  exports.listaPedidos = (req,res) =>{
    connection.query("SELECT usuario.nombre, COUNT(usuario.idUser) AS 'Activos',pedidos.idPedido, COUNT(pedidos.idPedido) AS 'pedidosact', SUM(pedidos.precioU) as 'totales', pedidos.estado FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser ORDER BY usuario.idUser DESC",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('admin',{
          data: results
        
        })
      
      }
    })

  }
exports.delete = (req,res) =>{
  const {idPedido} = req.params;
  connection.query("DELETE FROM pedidos WHERE idPedido = ?",[idPedido],async (error,results)=>{
    res.redirect('/pedidos')
  })
}



  
 /* 
 exports.pedactivos = (req,res) =>{
    connection.query("SELECT COUNT(estado) FROM pedidos WHERE estado = 'activo'",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('dashboard.ejs',{
          pedidos: results
        
        })
      
      }
    })

  }
  exports.users = (req,res) =>{
    connection.query("SELECT Nombre, correo, numero, direccion, idPedido, nombreProducto, tallaProducto, colorProducto, cantidad, precioU, link FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser AND pedidos.estado = 'activo' ORDER BY usuario.idUser DESC LIMIT 4",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('dashboard.ejs',{
          data: results
        
        })
      
      }
    })

  }
  exports.coments = (req,res) =>{
    connection.query("SELECT Nombre, correo, numero, direccion, idPedido, nombreProducto, tallaProducto, colorProducto, cantidad, precioU, link FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser AND pedidos.estado = 'activo' ORDER BY usuario.idUser DESC LIMIT 4",async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('dashboard.ejs',{
          data: results
        
        })
      
      }
    })

  }*/