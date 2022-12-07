const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();
const puppeteer = require('puppeteer');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')





// Settings
app.set("port", 8080);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

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
const { send } = require("process");
const { Console } = require("console");
const cookieParser = require("cookie-parser");


// routes
app.use(require("./routes/index"));
app.use("/links", require("./routes/links"));

// Statics Files
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

//server listening
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

//lista pedidos
app.get('/pedidos', async(req, res)=>{
  const pedidos= await connection.query('SELECT * FROM pedidos');
  console.log(pedidos);
})





//Scraping Web
//Inicio Scrapping H&M
app.post('/scrapHm', async(req,res)=>{
  

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
    let size = await page.$('#picker-1 > button');
    let Tamano= await page.evaluate(el => el.textContent,size);
   //Scraping Product Color
    let colors= await page.$('.product-input-label');
    let Color= await page.evaluate(el => el.textContent,colors);
    const Imagen1= await page.$eval(".module.product-description.sticky-wrapper .product-detail-main-image-container img",img => img.src);
    const Imagen2= await page.$eval(".pdp-secondary-image.pdp-image  img",img => img.src);



    const Titl = console.log(('El titulo es: '+Titulo));
    const Prc= console.log(('El Precio es: '+Precio));
    const Tamn=console.log(('El tamano es: '+Tamano));
    const Colr=console.log(('El Color es: '+Color));
    const im1=console.log(('url imagen es: '+Imagen1));
    const img2=console.log(('url imagen es: '+Imagen2));

    const Meesagge="Todos los derechos de los productos expuestos quedan reservados a nombre de la tienda internacional @H&M Hennes & Mauritz AB"
    
    await browser.close();
    
      res.render("product-detail.ejs",{
      Titulo:Titulo,
      Precio:Precio,
      Color:Color,
      Imagen1:Imagen1,
      Imagen2:Imagen2,
      Meesagge:Meesagge
    });
  
})();
})

//Scraping Web Section

//Inicio Scrapping Adidas
app.post('/scrapAdidas', async(req,res)=>{
  

  (async () => {
    const data= req.body;
    
    const urls= data.url;
  
  
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(urls);
    
  
    await page.waitForSelector('#product-title')
    
      //Scraping Product Title
      let title= await page.$('#product-title span');
      let Titulo= await page.evaluate(el => el.textContent,title);

      //Scraping Product Price
      
      let priceD= await page.$('#gl-price-item .gl-price-item gl-price-item--sale notranslate');

      if(priceD=!null){
        let Precio= await page.evaluate(el => el.textContent,priceD);
      }else{
        let price= await page.$('#gl-price-item .gl-price-item notranslate');
        let Precio= await page.evaluate(el => el.textContent,price);
      }
      
    
      let colors= await page.$('#color-label');
      let Color= await page.evaluate(el => el.textContent,colors);

      const Imagen1= await page.$eval("#pdp__image-viewer__desktop-zoom__content img",img => img.src);
      const Imagen2= await page.$eval(".view-cell-container___aqB7e #pdp__image-viewer__desktop-zoom__content  img",img => img.src);

      console.log(('El titulo es: '+Titulo));
      console.log(('El Precio es: '+Precio));
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
  
  //Inicio Scrapping Guess
  app.post('/scrapGuess', async(req,res)=>{
  

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
    
    //Inicio Scrapping Calvin
    app.post('/scrapCalvin', async(req,res)=>{
  

      (async () => {
        const data= req.body;
        
        const urls= data.url;
      
      
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(urls);
        
      
        await page.waitForSelector('#pdptestdelete > div.main-region')
        
          //Scraping Product Title
          let title= await page.$('#pdptestdelete > div.main-region > div > div.ds-container.product-detail.product-wrapper.pid-23103100-201 > div:nth-child(1) > div.col-12.col-lg-4.js-buying-controls.spacing-buying-controls > div.product-details--desk > div.row > div > div.product-detail__name > h1');
          let Titulo= await page.evaluate(el => el.textContent,title);

          //Scraping Product Price
          let price= await page.$('#pdptestdelete > div.main-region > div > div.ds-container.product-detail.product-wrapper.pid-23103020-030 > div:nth-child(1) > div.col-12.col-lg-4.js-buying-controls.spacing-buying-controls > div.product-details--desk > div.row > div > div.product-detail__prices > div > span:nth-child(1) > span > span');
          let Precio= await page.evaluate(el => el.textContent,price);
          
         //Scraping Product Color
          let colors= await page.$('#pdpAttribute > label > span.variation__attr--value.variation__attr--name--mobile');
          let Color= await page.evaluate(el => el.textContent,colors);
          const Imagen1= await page.$eval("#pdptestdelete > div.main-region > div > div.ds-container.product-detail.product-wrapper.pid-23103100-201 > div:nth-child(1) > div.product-images.col-12.col-lg-8.large-margin.product-image-container-desk > div > div > div > div:nth-child(1) > img",img => img.src);
          const Imagen2= await page.$eval("#pdptestdelete > div.main-region > div > div.ds-container.product-detail.product-wrapper.pid-23103100-201 > div:nth-child(1) > div.product-images.col-12.col-lg-8.large-margin.product-image-container-desk > div > div > div > div:nth-child(2) > img",img => img.src);

          console.log(('El titulo es: '+Titulo));
          console.log(('El Precio es: '+Precio));
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

      //Inicio Scrapping Nike
      
      app.post('/scrapNike', async(req,res)=>{
  

        (async () => {
          const data= req.body;
          
          const urls= data.url;
        
        
          const browser = await puppeteer.launch({headless: false});
          const page = await browser.newPage();
          await page.goto(urls);
          
        
          await page.waitForSelector('#RightRail')
          
            //Scraping Product Title
            let title= await page.$('#pdp_product_title');
            let Titulo= await page.evaluate(el => el.textContent,title);
            //Scraping Product Price
            let price= await page.$('#RightRail > div > div:nth-child(1) > div > div.d-lg-ib.mb0-sm.u-full-width.css-3rkuu4.css-1mzzuk6 > div > div > div > div > div');
            let Precio= await page.evaluate(el => el.textContentL,price);
            
            
           //Scraping Product Color
           let colors= await page.$('#RightRail > div > span > div > div > ul > li.description-preview__color-description.ncss-li');
           let Color= await page.evaluate(el => el.textContent,colors);
           const Imagen1= await page.$eval("#PDP > div.app-root > div > div:nth-child(4) > div.css-13pt6km > div.css-1rayx7p > div > ul > li.slide.selected > span > button > div > picture:nth-child(2) > img",img => img.src);
           const Imagen2= await page.$eval("#PDP > div.app-root > div > div:nth-child(4) > div.css-13pt6km > div.css-1rayx7p > div > ul > li.slide.selected > span > button > div > picture:nth-child(2) > img",img => img.src);
            console.log(('El titulo es: '+Titulo));
            console.log(('El Precio es: '+Precio));
            console.log(('El Color es: '+Color));
            console.log(('url imagen es: '+Imagen1));
            console.log(('url imagen es: '+Imagen2));
        
            
            
            await browser.close();
            /*
              res.render("product-detail.ejs",{
              Titulo:Titulo,
              Precio:Precio,
              Color:Color,
              Imagen1:Imagen1,
              Imagen2:Imagen2
            });
          */
        })();
        })
        
        //Inicio Scrapping Zara
        app.post('/scrapZara', async(req,res)=>{
  

          (async () => {
            const data= req.body;
            
            const urls= data.url;
          
          
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            await page.goto(urls);
            
          
            await page.waitForSelector('.product-detail-view__side-bar')
            
              //Scraping Product Title
              let title= await page.$('.product-detail-view__side-bar .product-detail-info__header h1');
              let Titulo= await page.evaluate(el => el.textContent,title);
              //Scraping Product Price
              let price= await page.$('#main > article > div.product-detail-view__content > div > div.product-detail-view__side-bar > div.product-detail-info > div.product-detail-info__price > div > span > span > span > div > span');
              let Precio= await page.evaluate(el => el.textContent,price);
        
             //Scraping Product Color
              let colors= await page.$('#main > article > div.product-detail-view__content > div > div.product-detail-view__side-bar > div.product-detail-info > p');
              let Color= await page.evaluate(el => el.textContent,colors);
              const Imagen1= await page.$eval("#main > article > div.product-detail-view__content > div.product-detail-view__main > div.product-detail-view__main-content > section > ul > li:nth-child(1) > button > div > div > picture > img",img => img.src);
              const Imagen2= await page.$eval("#main > article > div.product-detail-view__content > div.product-detail-view__main > div.product-detail-view__main-content > section > ul > li:nth-child(2) > button > div > div > picture > img",img => img.src);

              //console.log(('El titulo es: '+Titulo));
              //console.log(('El Precio es: '+Precio));
              //console.log(('El Color es: '+Color));
              //console.log(('url imagen es: '+Imagen1));
              //console.log(('url imagen es: '+Imagen2));
          
              const Meesagge="Todos los derechos de los productos expuestos quedan reservados a nombre de la tienda internacional @Zara"
              
              await browser.close();
              
               res.render("product-detail.ejs",{
                Titulo:Titulo,
                Precio:Precio,
                Color:Color,
                Imagen1:Imagen1,
                Imagen2:Imagen2,
                Meesagge:Meesagge
              });
            
          })();
          })
          
                              




app.post('/sp', async(req,res)=>{
  

  
  const data= req.body;

    //Capturamos los datos
    
    const Titulo= String(data.titulo);
    const Color= String(data.color);
    const Talla= String(data.talla);
    const Precio= String(data.precio);
    const Cantidad = String(data.cantidad);
    const nombre= localStorage.getItem("name");

  console.log(Titl);
    
  
   /* res.render("shoppingcart.ejs",{
      Title:Titulo,
      Size:Talla,
      Colors:Color,
      Price:Precio
    });
*/
  })


