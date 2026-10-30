const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("./models/product");

const products = [
  { name: "Midnight Oud", brand: "Noir House", category: "Men", price: 14500, stock: 25, featured: true, rating: 4.8, image: "/products/p1.jpg", description: "Deep oud with amber and smoky woods. A bold evening fragrance." },
  { name: "Rose Eclat", brand: "Maison Rose", category: "Women", price: 12800, stock: 30, featured: true, rating: 4.7, image: "/products/p2.jpg", description: "Fresh Taif rose with soft musk and vanilla." },
  { name: "Velvet Amber", brand: "Noir House", category: "Unisex", price: 16900, stock: 18, featured: true, rating: 4.9, image: "/products/p3.jpg", description: "Warm amber, sandalwood and a hint of spice." },
  { name: "Citrus Breeze", brand: "Aqua Lab", category: "Men", price: 8900, stock: 40, featured: false, rating: 4.4, image: "/products/p4.jpg", description: "Bright bergamot and lemon with a clean marine finish." },
  { name: "Jasmine Dream", brand: "Maison Rose", category: "Women", price: 11200, stock: 22, featured: false, rating: 4.6, image: "/products/p5.jpg", description: "White jasmine, peach and creamy sandalwood." },
  { name: "Black Leather", brand: "Noir House", category: "Men", price: 15700, stock: 15, featured: true, rating: 4.8, image: "/products/p6.jpg", description: "Smooth leather, tobacco and dark vanilla." },
  { name: "Silk Musk", brand: "Aqua Lab", category: "Unisex", price: 9800, stock: 35, featured: false, rating: 4.5, image: "/products/p7.jpg", description: "Soft white musk that feels like clean silk." },
  { name: "Saffron Nights", brand: "Royal Attar", category: "Unisex", price: 18500, stock: 12, featured: true, rating: 4.9, image: "/products/p8.jpg", description: "Rich saffron, oud and rose in a luxury blend." },
  { name: "Cherry Blossom", brand: "Maison Rose", category: "Women", price: 10400, stock: 28, featured: false, rating: 4.3, image: "/products/p9.jpg", description: "Light floral with cherry and green tea notes." },
  { name: "Ocean Storm", brand: "Aqua Lab", category: "Men", price: 9200, stock: 33, featured: false, rating: 4.4, image: "/products/p10.jpg", description: "Sea salt, mint and cedar. Fresh and sporty." },
  { name: "Sandal Royale", brand: "Royal Attar", category: "Unisex", price: 13900, stock: 20, featured: false, rating: 4.6, image: "/products/p11.jpg", description: "Creamy Mysore sandalwood with soft spices." },
  { name: "Vanilla Noir", brand: "Noir House", category: "Women", price: 12100, stock: 26, featured: false, rating: 4.7, image: "/products/p12.jpg", description: "Dark vanilla, caramel and a touch of patchouli." },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Seeded " + products.length + " products");
  } catch (e) {
    console.log("Seed error:", e.message);
  } finally {
    await mongoose.disconnect();
  }
})();
