const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/authMiddleware');
const Product = require('../Models/Product');

// POST /api/cart/add
// Body: { productId, quantity }
router.post('/add', auth, async (req, res) => {
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Only customers can add to cart' });
  }

  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: `Only ${product.quantity} items in stock` 
      });
    }

    // Here you can implement:
    // Option 1: Server-side cart (recommended for accuracy)
    // Option 2: Just validate and let frontend handle (we'll show both)

    res.json({
      message: 'Item can be added to cart',
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantityAvailable: product.quantity
      },
      requestedQuantity: quantity
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;