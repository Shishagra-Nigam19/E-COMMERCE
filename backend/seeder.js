const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const { users, products } = require('./data/sampleData');

dotenv.config();

// Connect to database
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected for seeding'.green.inverse))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:'.red, err.message);
        process.exit(1);
    });

// Import data
const importData = async () => {
    try {
        // Clear existing data
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        console.log('✅ Users imported'.green.inverse);

        // Add admin user to products
        const sampleProducts = products.map((product) => {
            return { ...product };
        });

        await Product.insertMany(sampleProducts);

        console.log('✅ Products imported'.green.inverse);
        console.log('✅ Data Import Success!'.green.inverse);
        console.log('\n📧 Admin Login:'.cyan.bold);
        console.log('   Email: admin@ecommerce.com'.cyan);
        console.log('   Password: admin123'.cyan);
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Destroy data
const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('✅ Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error}`.red.inverse);
        process.exit(1);
    }
};

// Check command line arguments
if (process.argv[2] === '-d') {
    destroyData();
} else if (process.argv[2] === '-i') {
    importData();
} else {
    console.log('Usage:'.yellow);
    console.log('  node seeder.js -i   (Import data)'.cyan);
    console.log('  node seeder.js -d   (Destroy data)'.red);
    process.exit();
}
