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

        // Fetch product context (Essential for grounding the AI)
        const products = await Product.find({}).select('name price category stock description');
        const contextData = JSON.stringify(products);

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a helpful and strict store assistant for an e-commerce shop. 
                    
                    HERE IS THE REAL-TIME PRODUCT DATABASE:
                    ${contextData}

                    RULES:
                    1. ONLY answer questions about products based on the database above.
                    2. If a product is not in the database, say "I'm sorry, we don't carry that item." DO NOT makeup products.
                    3. For availability consistency:
                       - usage of "stock" field: 0 means out of stock.
                    4. Be friendly but professional.
                    5. Keep answers concise.`
                },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.3, // Lower temperature for more factual answers
        });

        res.json({ response: completion.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ response: "I'm having trouble connecting to my brain right now. Please try again later." });
    }
};
