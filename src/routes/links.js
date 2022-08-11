const express = require("express");
const router = express.Router();

const pool = require("../../database/database");

router.get("/login", (req, res) => {
  res.render("links/login");
});
module.exports = router;
