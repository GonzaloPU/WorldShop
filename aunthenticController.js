const jwt = require ('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const connection = require('../database/database')
const {promisify} = require('util');
const { json } = require('express');
const cookieParser = require('cookie-parser');
const session = require("express-session");


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
    const idUser=2;
    const nombre='mario gonzalez';
  
    let passwordHaash = await bcryptjs.hash(pass,8);
    const passw=passwordHaash;
    
   connect.query('INSERT INTO usuario SET ?', {idUser:idUser,nombre:nombre,user:user, pass:passw,correo:correo, direccion:direccion,  numero:numero, genero:genero}, async(error,results)=>{
    if(error){
      res.send(error);
    }else{
      res.render("login.ejs");
     }
  })
    } catch (error) {
      console.log(error);
      res.render('/login')
    }
    
    
  };
  
  //Login
  exports.login = async(req,res)=>{
  
    try {
      const data= req.body;
    
    const user= data.username;
    const pass= data.password;
    req.session.user = user;
  
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
        if(results.length == 0 || (await bcryptjs.compare(pass, results[0].pass))){
          console.log(await bcryptjs.compare(pass, results[0].pass))
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
          if(results[0].rol='0'){          
            res.render('profile.ejs', {
            User:user,
            data: results,
            alert: true,
            alertTitle: "Conexión exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon:'success',
            showConfirmButton: false,
            timer: 1100,
            ruta: ''
       })}else{          
        res.render('dashboard.ejs', {
        User:user,
        data: results,
        alert: true,
        alertTitle: "Conexión exitosa",
        alertMessage: "¡LOGIN CORRECTO!",
        alertIcon:'success',
        showConfirmButton: false,
        timer: 1100,
        ruta: ''
   })}          


  
       
        
        }
      })
    }
      
  }} catch (error) {
      console.log(error);
      res.render('/login')
      
    }
  
    
  
  }
  
  exports.isAuthenticated = async (req, res, next)=>{
    console.log(req.cookies)
    if (req.cookies.User) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM usuario WHERE idUser = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                console.log(results)
                req.user = results[0]
                return next()
                
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
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
    connection.query("SELECT * FROM usuario ",async (error,results)=>{
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
    connection.query("SELECT *, SUM(precioU)  AS 'total', COUNT(usuario.idUser) AS 'usuarios' FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser AND pedidos.estado = 'activo' ORDER BY usuario.idUser DESC LIMIT 4; ",
    "SELECT COUNT(estado) AS 'activos' FROM pedidos WHERE estado = 'activo'"
    ,async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('dashboard.ejs',{
          data: results
        
        })
      
      }
    })

  }
  
  
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

  }
  exports.perfil = async (req,res) =>{ 
      console.log(req.session.user)
      const user = req.session.user;
     
      connection.query("SELECT * FROM usuario WHERE user = ?", [user],async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('profile.ejs',{
          data: results
        
        })
      
      }
    }) 

  }
  exports.pedidosUser = (req,res) =>{
    console.log(req.session.user)
    const user = req.session.user;
   
    connection.query("SELECT user,Nombre, nombreProducto, tallaProducto, colorProducto, cantidad, precioU, link, estado FROM pedidos INNER JOIN usuario ON pedidos.idCliente = usuario.idUser WHERE user = ? ",[user],async (error,results)=>{
      if(error){
        console.log(error)
      }else{
        res.render('userped.ejs',{
          data: results
        
        })
      
      }
    })

  }