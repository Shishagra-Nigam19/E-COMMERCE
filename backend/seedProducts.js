const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const sampleProducts = [
    // --- Electronics ---
    { name: "MacBook Pro 16", price: 2499, description: "M3 Max chip, 32GB RAM, 1TB SSD", category: "Electronics", stock: 15, imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8" },
    { name: "iPhone 15 Pro Max", price: 1199, description: "Titanium design, A17 Pro chip", category: "Electronics", stock: 25, imageUrl: "https://images.unsplash.com/photo-1696446701796-da61225697cc" },
    { name: "Samsung Galaxy S24 Ultra", price: 1299, description: "AI features, S-Pen included", category: "Electronics", stock: 20, imageUrl: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c" },
    { name: "Sony WH-1000XM5", price: 348, description: "Industry leading noise canceling", category: "Electronics", stock: 30, imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb" },
    { name: "iPad Air 5", price: 599, description: "M1 chip, 10.9-inch Liquid Retina", category: "Electronics", stock: 18, imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" },
    { name: "PlayStation 5 Slim", price: 499, description: "Gaming console with 1TB SSD", category: "Electronics", stock: 12, imageUrl: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3" },
    { name: "Nintendo Switch OLED", price: 349, description: "7-inch OLED screen", category: "Electronics", stock: 22, imageUrl: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e" },
    { name: "Canon EOS R6 Mark II", price: 2499, description: "Full-frame mirrorless camera", category: "Electronics", stock: 8, imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32" },
    { name: "Dell XPS 15", price: 1899, description: "OLED Touch display, i9 processor", category: "Electronics", stock: 10, imageUrl: "https://images.unsplash.com/photo-1593642632823-8f78536788c6" },
    { name: "Apple Watch Ultra 2", price: 799, description: "Rugged titanium case, 36hr battery", category: "Electronics", stock: 20, imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },

    // --- Fashion & Footwear ---
    { name: "Nike Air Jordan 1", price: 180, description: "Classic high-top basketball shoes", category: "Fashion", stock: 40, imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
    { name: "Adidas Ultraboost 23", price: 190, description: "Energy return running shoes", category: "Fashion", stock: 35, imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5" },
    { name: "Levi's 501 Original", price: 98, description: "Straight fit men's jeans", category: "Fashion", stock: 60, imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d" },
    { name: "The North Face Nuptse", price: 320, description: "700-fill down puffer jacket", category: "Fashion", stock: 15, imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5" },
    { name: "Ray-Ban Aviator Classic", price: 163, description: "Gold frame, G-15 lens", category: "Fashion", stock: 45, imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f" },
    { name: "Herschel Little America", price: 120, description: "Classic mountaineering backpack", category: "Fashion", stock: 50, imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" },
    { name: "Casio G-Shock", price: 99, description: "Indestructible digital watch", category: "Fashion", stock: 30, imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314" },
    { name: "Patagonia Fleece", price: 139, description: "Recycled polyester pullover", category: "Fashion", stock: 25, imageUrl: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721" },
    { name: "Timberland 6-Inch Boot", price: 198, description: "Premium waterproof leather", category: "Fashion", stock: 20, imageUrl: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0" },
    { name: "Uniqlo Airism Tee", price: 29, description: "Breathable oversized t-shirt", category: "Fashion", stock: 100, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab" },

    // --- Home & Kitchen ---
    { name: "KitchenAid Artisan", price: 449, description: "5-quart tilt-head stand mixer", category: "Home", stock: 12, imageUrl: "https://images.unsplash.com/photo-1582735689369-c613c66e2159" },
    { name: "Dyson V15 Detect", price: 749, description: "Cordless vacuum with laser", category: "Home", stock: 10, imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001" },
    { name: "Nespresso Vertuo", price: 199, description: "Coffee and espresso machine", category: "Home", stock: 25, imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6" },
    { name: "Herman Miller Aeron", price: 1250, description: "Ergonomic office chair", category: "Home", stock: 5, imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1" },
    { name: "Philips Hue Starter Kit", price: 159, description: "Color smart bulbs (4-pack)", category: "Home", stock: 30, imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1" },
    { name: "Le Creuset Dutch Oven", price: 420, description: "Enameled cast iron 5.5qt", category: "Home", stock: 15, imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff" },
    { name: "Sonos Era 100", price: 249, description: "Smart speaker with bluetooth", category: "Home", stock: 20, imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d" },
    { name: "Instant Pot Pro", price: 129, description: "10-in-1 pressure cooker", category: "Home", stock: 35, imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62" },
    { name: "Yankee Candle", price: 29, description: "Large jar candle, clean cotton", category: "Home", stock: 60, imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59" },
    { name: "NutriBullet Pro", price: 89, description: "High-speed blender 900w", category: "Home", stock: 40, imageUrl: "https://images.unsplash.com/photo-1570222094114-28a9d8894b74" },

    // --- Beauty & Personal Care ---
    { name: "Dyson Airwrap", price: 599, description: "Multi-styler for hair", category: "Beauty", stock: 8, imageUrl: "https://images.unsplash.com/photo-1629363065609-8472506b12f7" },
    { name: "La Mer Moisturizer", price: 380, description: "Crème de la Mer 60ml", category: "Beauty", stock: 10, imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be" },
    { name: "Olaplex No. 3", price: 30, description: "Hair perfector repair treatment", category: "Beauty", stock: 50, imageUrl: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e" },
    { name: "Chanel Coco Mademoiselle", price: 135, description: "Eau de Parfum 100ml", category: "Beauty", stock: 20, imageUrl: "https://images.unsplash.com/photo-1594035910387-fea477942698" },
    { name: "Philips Sonicare 9900", price: 299, description: "Prestige power toothbrush", category: "Beauty", stock: 15, imageUrl: "https://images.unsplash.com/photo-1553556846-51e89b43c688" },
    { name: "Kiehl's Facial Cream", price: 38, description: "Ultra facial moisturizer", category: "Beauty", stock: 40, imageUrl: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd" },
    { name: "Dior Sauvage", price: 120, description: "Men's Eau de Toilette", category: "Beauty", stock: 30, imageUrl: "https://images.unsplash.com/photo-1523293188086-b46e0a86791a" },
    { name: "MAC Ruby Woo", price: 25, description: "Retro matte lipstick", category: "Beauty", stock: 60, imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" },

    // --- Sports & Outdoors ---
    { name: "Yeti Tundra 45", price: 325, description: "Hard cooler, ice retention", category: "Sports", stock: 12, imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97" },
    { name: "Lululemon Yoga Mat", price: 88, description: "The Reversible Mat 5mm", category: "Sports", stock: 40, imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f" },
    { name: "Bowflex SelectTech", price: 429, description: "Adjustable dumbbells 552", category: "Sports", stock: 8, imageUrl: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f" },
    { name: "Wilson NBA Basketball", price: 30, description: "Official game ball replica", category: "Sports", stock: 50, imageUrl: "https://images.unsplash.com/photo-1519861531473-920026393112" },
    { name: "Fitbit Charge 6", price: 159, description: "Health and fitness tracker", category: "Sports", stock: 35, imageUrl: "https://images.unsplash.com/photo-1576243345690-8e4b728d3e68" },
    { name: "Hydro Flask 32oz", price: 45, description: "Wide mouth water bottle", category: "Sports", stock: 60, imageUrl: "https://images.unsplash.com/photo-1602143407151-cd11122448dc" },
    { name: "Spalding Golf Set", price: 299, description: "Complete golf club set", category: "Sports", stock: 5, imageUrl: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b" }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Clear existing products to ensure clean slate with new categories
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log(`✅ Added ${sampleProducts.length} premium products`);

        mongoose.disconnect();
        console.log("👋 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
};

seedProducts();
