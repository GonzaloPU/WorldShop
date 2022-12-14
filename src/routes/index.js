const express = require("express");
const router = express.Router();
const bcryptjs= require('bcryptjs');
const connection = require("../../database/database");
const { results } = require("express-validator");
const app= express.Router();
const aunthentic = require('../../controllers/aunthenticController')


router.use(express.static(__dirname ));


router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/index", (req, res) => {
  res.render("index.ejs");
});

router.get("/carro_login", (req, res) => {
  res.render("carro_login.ejs");
});

router.get("/about", (req, res) => {
  res.render("about.ejs");
});
router.get("/blog_simple", (req, res) => {
  res.render("blog_simple.ejs");
});
router.get("/blog", (req, res) => {
  res.render("blog.ejs");
});
router.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
router.get("/project", (req, res) => {
  res.render("project.ejs");
});
router.get("/servicios", (req, res) => {
  res.render("servicios.ejs");
});
router.get("/team", (req, res) => {
  res.render("team.ejs");
});
router.get("/login", (req, res) => {
  res.render("login.ejs", {alert:false});
});
router.get("/registration", (req, res) => {
  res.render("registration.ejs");
});
router.get("/H&M", (req, res) => {
  res.render("product-url-hm.ejs");
});
router.get("/Nike", (req, res) => {
  res.render("product-url-nike.ejs");
});
router.get("/Adidas", (req, res) => {
  res.render("product-url-adidas.ejs");
});
router.get("/Guess", (req, res) => {
  res.render("product-url-guess.ejs");
});
router.get("/CK", (req, res) => {
  res.render("product-url-calvin.ejs");
});
router.get("/Zara", (req, res) => {
  res.render("product-url-zara.ejs");
});
router.get("/shoppingcart", (req, res) => {
  res.render("shoppingcart.ejs");
});
router.get("/productdetail", (req, res) => {
  res.render("product-detail.ejs");
});
router.get("/profile", (req, res) => {
  res.render("profile.ejs");
});
router.get("/usuario-pedido", (req, res) => {
  res.render("usuario-pedido.ejs");
});
router.get("/usuario-perfil", (req, res) => {
  res.render("usuario-perfil.ejs");
});
router.get("/userped", (req, res) => {
  res.render("userped.ejs");
});
router.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});
router.get("/orden", (req, res) => {
  res.render("orden.ejs");
});
router.get("/admin-ped", (req, res) => {
  res.render("admin-pedidos.ejs");
});
router.get("/stores", (req, res) => {
  res.render("stores.ejs");
});
router.get("/admin",aunthentic.listaPedidos, (req, res) => {
  res.render("dashboard.ejs");
});

router.get("/pedidos", aunthentic.listaPedido,  (req, res) => {
  res.render("orders.ejs");
});
router.get("/usuarios", aunthentic.listaUsuario, (req, res) => {
  res.render("admin-users.ejs");
});

router.get("/perfil", (req, res) => {
  res.render("profile.ejs");
});
router.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});

router.get("/terminos-y-condiciones", (req, res) => {
  res.render("terms_and_conditions.ejs");
});


//direcciones

router.post('/logins', aunthentic.logins)
router.get('/delete/:idPedido', aunthentic.delete)
router.post('/regi', aunthentic.regi)
router.post('/pay', aunthentic.pay)
router.get('/logout', aunthentic.logout)

module.exports = router;
