const express = require("express");
const router = express.Router();
const bcryptjs= require('bcryptjs');
const connection = require("../../database/database");
const { results } = require("express-validator");
const app= express();

router.use(express.static(__dirname + "../public"));

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/index", (req, res) => {
  res.render("index.ejs");
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
  res.render("login.ejs");
});
router.get("/registration", (req, res) => {
  res.render("registration.ejs");
});
router.get("/productourl", (req, res) => {
  res.render("productourl.ejs");
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

module.exports = router;
