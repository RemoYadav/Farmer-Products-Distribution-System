const Product = require("../Models/Product");
const mongoose = require("mongoose");
const Activity = require("../Models/Activity")
/**
 * @desc    Create new product
 * @route   POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    const { email, userId, role } = req.user; // from JWT middleware
    const {

      productName,
      category,
      price,
      unit,
      stock,
      description,
    } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path; // This stores 'uploads/filename.jpg'
    }
    if (!productName || !category) {
      return res.status(400).json({ message: "Product name and category are required" });
    }
    const product = await Product.create({
      farmerId: userId,
      productName,
      category,
      price: Number(price),
      unit,
      stock: Number(stock),
      description,
      image: imagePath
    });
    
  await Activity.create({
    userId:userId,
    title : "Add Product",
    message : `New product ${product.productName} added.`,

  });

    return res.status(201).json({
      success: true,
      message: "Product created successfully"
    });

  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products
 */
exports.getProducts = async (req, res) => {
  try {
    const { email, userId, role } = req.user;
    // from JWT middleware
    if ((role === "admin")) {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(200).json(products);
    } if ((role ==="customer")){
      const products = await Product.find({  access: "allowed" }).sort({ createdAt: -1 });

      res.status(200).json(products);
    }
    if ((role ==="farmer")){
      const products = await Product.find({ farmerId:userId, access: "allowed" }).sort({ createdAt: -1 });

      res.status(200).json(products);
    }
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

exports.getPlaceProductsOrder = async (req, res) => {
  try {
    const { email, userId, role } = req.user; // from JWT middleware
    // if(!(role === "customer")){
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ products, message: "Product finded" });
    // }
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};
/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find existing product first
    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Build update data
    const updateData = {
      productName: req.body.productName,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      stock: req.body.stock,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    // Remove undefined fields from updateData
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) delete updateData[key];
    });

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update",
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Compare and log only changed fields
    const changes = [];
    for (const key of Object.keys(updateData)) {
      if (oldProduct[key] !== updatedProduct[key]) {
        changes.push(`${key}: "${oldProduct[key]}" → "${updatedProduct[key]}"`);
      }
    }

    if (changes.length > 0) {
      await Activity.create({
        userId: userId,
        title: "Product Updated",
        message: `${updatedProduct.productName} Updated fields: ${changes.join(", ")}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Product update failed",
    });
  }
};



/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res) => {
  try {
     const { email, userId, role } = req.user;
    const { id } = req.params;

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Soft delete / deny access
    product.access = "denied";
    await product.save();
  
  await Activity.create({
    userId :userId,
    title:"Delete Product",
    message : `${product.productName} deleted the product`,
  });

    return res.status(200).json({
      success: true,
      message: "Product Deleted successfully",

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server not responding" });
  }
};

