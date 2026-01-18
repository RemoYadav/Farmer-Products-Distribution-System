const Farmer =require("../Models/Farmer.js");
const Product = require("../Models/Product.js");

exports.getMarketProducts = async (req, res) => {
  try {
    const farmers = await Farmer.find();

    const response = [];

    for (const farmer of farmers) {
      const products = await Product.find({
        farmerId: farmer.userId,
        access: "allowed"
      });

      if (products.length === 0) continue;

      response.push({
        id: farmer.userId,
        name: farmer.farmName,
        owner: farmer.fullName,
        location: farmer.location,
        rating: farmer.rating,
        description: farmer.description,
        email: farmer.email,
        phone: farmer.phone,
        certified: farmer.certified,
        totalProducts: products.length,
        products: products.map(p => ({
          id: p._id,
          name: p.productName,
          category: p.category,
          price: p.price,
          unit: p.unit,
          stock: p.stock,
          description: p.description,
          image: p.image
            ? p.image
            : null
        }))
      });
    }

    res.json(response);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
