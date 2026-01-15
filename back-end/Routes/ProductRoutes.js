const express = require("express");
const router = express.Router();

const productController = require("../Controllers/ProductController");
const authMiddleware = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/multerConfig"); 
router.post("/",authMiddleware,upload.single("image"), productController.createProduct);
router.get("/products",authMiddleware, productController.getProducts);
router.get("/",authMiddleware, productController.getProducts);
// router.put("/:id",authMiddleware, productController.updateProduct);
router.patch("/delete:id",authMiddleware, productController.deleteProduct);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"), // <-- must match FormData key
  productController.updateProduct
);

module.exports = router;
