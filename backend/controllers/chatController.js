const Product = require("../models/Product");
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.chat = async (req, res) => {
    const { message } = req.body;
    try {
        // Simple keyword fallback if OpenAI fails or for speed
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
            const products = await Product.find({});
            const productNames = products.map(p => p.name).join(", ");
            return res.json({ response: `(Offline Mode) We have: ${productNames}. Please ask about specific products!` });
        }

        // 1. Determine Intent (Simplified)
        let contextData = "";

        if (message.toLowerCase().includes("stock") || message.toLowerCase().includes("price") || message.toLowerCase().includes("have")) {
            // Fetch all products for context
            const products = await Product.find({});
            contextData = JSON.stringify(products.map(p => ({ name: p.name, price: p.price, stock: p.stock, category: p.category })));
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: `You are a helpful store assistant. Use this product data to answer: ${contextData}` },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });

        res.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "I'm having trouble connecting to my brain right now. Please try again later." });
    }
};
