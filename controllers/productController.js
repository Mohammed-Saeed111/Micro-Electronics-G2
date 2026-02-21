const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query = {};
        
        if (name) query.name = { $regex: name, $options: 'i' };
        if (category) query.category = { $regex: category, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        
        const products = await Product.find(query);
        res.status(200).json({ msg: "Success", data: products });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        
        if (!name || !price || !description || !category) {
            return res.status(400).json({ msg: "Missing Data" });
        }

        const product = await Product.create({ name, price, description, category, stock });
        res.status(201).json({ msg: "Product Created", data: product });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        
        if (!product) {
            return res.status(404).json({ msg: "Product Not Found" });
        }

        res.status(200).json({ msg: "Product Deleted", data: product });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
