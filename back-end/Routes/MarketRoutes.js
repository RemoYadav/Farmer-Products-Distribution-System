const express = require("express");
const {getMarketProducts} =  require("../Controllers/MarketController")
const router = express.Router();

router.get("/products",  getMarketProducts);


module.exports = router;
