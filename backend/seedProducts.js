const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const sampleProducts = [
    {
        name: "MacBook Pro 16",
        price: 2499,
        description: "Powerful laptop with M3 chip and 16GB RAM",
        category: "Electronics",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
    },
    {
        name: "iPhone 15 Pro",
        price: 1199,
        description: "Latest iPhone with A17 Pro chip and titanium design",
        category: "Electronics",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1592286927505-2fd0c6a3d27e"
    },
    {
        name: "Samsung Galaxy S24",
        price: 899,
        description: "Flagship Android phone with AI features",
        category: "Electronics",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c"
    },
    {
        name: "Sony WH-1000XM5",
        price: 399,
        description: "Premium noise-cancelling headphones",
        category: "Electronics",
        stock: 30,
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
        name: "iPad Air",
        price: 599,
        description: "Versatile tablet with M1 chip",
        category: "Electronics",
        stock: 18,
        imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0"
    },
    {
        name: "Nike Air Max",
        price: 120,
        description: "Comfortable running shoes with air cushioning",
        category: "Footwear",
        stock: 50,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
    },
    {
        name: "Adidas Ultraboost",
        price: 180,
        description: "High-performance running shoes",
        category: "Footwear",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5"
    },
    {
        name: "Levi's 501 Jeans",
        price: 89,
        description: "Classic straight-fit denim jeans",
        category: "Clothing",
        stock: 60,
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d"
    },
    {
        name: "North Face Jacket",
        price: 299,
        description: "Waterproof outdoor jacket",
        category: "Clothing",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5"
    },
    {
        name: "Ray-Ban Aviators",
        price: 154,
        description: "Classic aviator sunglasses",
        category: "Accessories",
        stock: 45,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    },
    {
        name: "Fossil Smartwatch",
        price: 249,
        description: "Stylish hybrid smartwatch",
        category: "Accessories",
        stock: 35,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30"
    },
    {
        name: "Canon EOS R6",
        price: 2499,
        description: "Professional mirrorless camera",
        category: "Electronics",
        stock: 10,
        imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f"
    },
    {
        name: "Sony PlayStation 5",
        price: 499,
        description: "Next-gen gaming console",
        category: "Electronics",
        stock: 12,
        imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3"
    },
    {
        name: "Nintendo Switch OLED",
        price: 349,
        description: "Portable gaming console with vibrant display",
        category: "Electronics",
        stock: 22,
        imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e"
    },
    {
        name: "KitchenAid Stand Mixer",
        price: 429,
        description: "Professional 5-quart stand mixer",
        category: "Home & Kitchen",
        stock: 20,
        imageUrl: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce"
    },
    {
        name: "Dyson V15 Vacuum",
        price: 649,
        description: "Cordless vacuum with laser detection",
        category: "Home & Kitchen",
        stock: 15,
        imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001"
    },
    {
        name: "Instant Pot Duo",
        price: 99,
        description: "7-in-1 programmable pressure cooker",
        category: "Home & Kitchen",
        stock: 40,
        imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62"
    },
    {
        name: "Yoga Mat Premium",
        price: 45,
        description: "Eco-friendly non-slip yoga mat",
        category: "Sports",
        stock: 55,
        imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f"
    },
    {
        name: "Resistance Bands Set",
        price: 29,
        description: "Set of 5 resistance bands for home workout",
        category: "Sports",
        stock: 70,
        imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc"
    },
    {
        name: "Dumbbells Set",
        price: 159,
        description: "Adjustable dumbbell set 5-52.5 lbs",
        category: "Sports",
        stock: 25,
        imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f"
    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Clear existing products (optional - comment out if you want to keep existing)
        // await Product.deleteMany({});
        // console.log("🗑️  Cleared existing products");

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`✅ Added ${sampleProducts.length} sample products`);

        mongoose.disconnect();
        console.log("👋 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedProducts();
