const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const puppeteer = require('puppeteer');


// Settings
app.set("port", 8080);

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

// Global Variables
app.use((req, res, next) => {
  next();
});

//DB connection
const connect = require('../database/database');

// bcryptjs
const bcryptjs = require("bcryptjs");

// session
const session = require("express-session");
const connection = require("../database/database");
const { randomInt } = require("crypto");
const { Result } = require("express-validator");
const { cp } = require("fs");
const { parse } = require("path");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// routes
app.use(require("./routes/index"));
app.use("/links", require("./routes/links"));

// Statics Files
app.use(express.static(path.join(__dirname, "public")));

//server listening
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

//registration
app.post('/regi', async (req,res)=>{

  const data= req.body;
  
  const username= data.user;
  const password= data.pass;
  const genero= data.gen;
  const idCliente= data.idCl;
  const email= data.ema;
  const numero= data.num;
  let numr= randomInt(100);
  
  let passwordHaash = await bcryptjs.hash(password,8);
  const passw=passwordHaash;
  
 connect.query('INSERT INTO usuario SET ?', {idUsuario:numr,username:username, password:passw, genero:genero, idCliente:idCliente, email:email, numero:numero}, async(error,results)=>{
  if(error){
    res.send(error);
  }else{
    res.render("login.ejs");
   }
})
  
});

//Login
app.post('/auth', async(req,res)=>{

  const data= req.body;
  
  const username= data.user;
  const password= data.pass;

  let passwordHaash = await bcryptjs.hash(password,8);
  const passw=passwordHaash;

  if(username && password){
    connection.query('SELECT * FROM usuario WHERE username= ?', [username], async (error,Result)=>{
      if(Result.length == 0 || !(await bcryptjs.compare(password, Result[0].password))){
        res.send('USUARIO Y/O PASSWORD INCORRECTAS');
      }else{
        res.send('LOGIN CORRECTO')
      }
    })
  }

})

//Scraping Web
app.post('/scrap', async(req,res)=>{
  

(async () => {
  const data= req.body;
  
  const urls= data.url;


  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto(urls);
  

  await page.waitForSelector('.ProductName-module--container__3e-gi h1')
  
    //Scraping Product Title
    let title= await page.$('.ProductName-module--container__3e-gi h1');
    let Titulo= await page.evaluate(el => el.textContent,title);
    //Scraping Product Price
    let price= await page.$('.ProductPrice-module--productItemPrice__2i2Hc .Price-module--black-large__2lI2s');
    let Precio= await page.evaluate(el => el.textContent,price);
    //Scraping Product Size
    //let size= await page.$('#picker-1 .picker-list [data-code]');
    //var Tamano = await page.$eval("select.option active", selectedValue=> selectedValue.value)
    //let Tamano= await page.evaluate(el => el.textContent,size);
   //Scraping Product Color
    let colors= await page.$('.product-input-label');
    let Color= await page.evaluate(el => el.textContent,colors);
    const Imagen1= await page.$eval(".module.product-description.sticky-wrapper .product-detail-main-image-container img",img => img.src);
    const Imagen2= await page.$eval(".pdp-secondary-image.pdp-image  img",img => img.src);
    console.log(('El titulo es: '+Titulo));
    console.log(('El Precio es: '+Precio));
    //console.log(('El tamano es: '+Tamano));
    console.log(('El Color es: '+Color));
    console.log(('url imagen es: '+Imagen1));
    console.log(('url imagen es: '+Imagen2));

    
    
    await browser.close();
    
      res.render("product-detail.ejs",{
      Titulo:Titulo,
      Precio:Precio,
      Color:Color,
      Imagen1:Imagen1,
      Imagen2:Imagen2
    });
  
})();
})

app.post('/sp', async(req,res)=>{
  

  
    const data= req.body;

    //Capturamos los datos

    const Titulo= data.titulo;
    const Color= data.color;
    const Talla= data.talla;
    const Precio= data.precio;

    console.log(Color);
  
   /* res.render("shoppingcart.ejs",{
      Title:Titulo,
      Size:Talla,
      Colors:Color,
      Price:Precio
    });
*/
  })
