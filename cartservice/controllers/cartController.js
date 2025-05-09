import { Cart, Product } from '../models/index.js';
import axios from 'axios';
import config from '../config/config.js';

// Get user's cart
export const getCart = async (req, res) => {
    try {
        console.log('Getting cart for user:', req.userId);
        
        if (!req.userId) {
            console.log('No user ID found in request');
            return res.status(401).json({ message: 'User ID not found' });
        }

        console.log('Looking for cart with user ID:', req.userId);
        let cart = await Cart.findOne({ user: req.userId })
            .populate({
                path: 'items.product',
                select: 'name price image _id'
            });
        
        if (!cart) {
            console.log('No cart found, creating new cart');
            cart = new Cart({
                user: req.userId,
                items: []
            });
            await cart.save();
        }
        
        // Ensure all items have valid product data
        const validItems = cart.items.filter(item => item.product !== null);
        cart.items = validItems;
        
        console.log('Cart found:', cart);
        res.status(200).json({
            _id: cart._id,
            user: cart.user,
            items: cart.items.map(item => ({
                _id: item._id,
                product: item.product ? {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image
                } : null,
                quantity: item.quantity
            })),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        console.log('Adding to cart for user:', req.userId);
        const { productId, quantity } = req.body;

        if (!req.userId) {
            console.log('No user ID found in request');
            return res.status(401).json({ message: 'User ID not found' });
        }

        // Verify product exists in product service
        try {
            const productResponse = await axios.get(`${config.productServiceUrl}/api/products/${productId}`);
            const productData = productResponse.data;

            // Create or update product in cart service
            let product = await Product.findById(productId);
            if (!product) {
                product = new Product({
                    _id: productData._id,
                    name: productData.name,
                    description: productData.description,
                    price: productData.price,
                    category: productData.category,
                    stock: productData.stock,
                    image: productData.image
                });
                await product.save();
            }

            let cart = await Cart.findOne({ user: req.userId });

            if (!cart) {
                cart = new Cart({
                    user: req.userId,
                    items: []
                });
            }

            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
            await cart.populate({
                path: 'items.product',
                select: 'name price image _id'
            });
            
            res.status(200).json({
                _id: cart._id,
                user: cart.user,
                items: cart.items.map(item => ({
                    _id: item._id,
                    product: item.product ? {
                        _id: item.product._id,
                        name: item.product.name,
                        price: item.product.price,
                        image: item.product.image
                    } : null,
                    quantity: item.quantity
                })),
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            if (error.response && error.response.status === 404) {
                return res.status(404).json({ message: 'Product not found' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!req.userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: req.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name price image _id'
        });
        
        res.status(200).json({
            _id: cart._id,
            user: cart.user,
            items: cart.items.map(item => ({
                _id: item._id,
                product: item.product ? {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image
                } : null,
                quantity: item.quantity
            })),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!req.userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: req.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate({
            path: 'items.product',
            select: 'name price image _id'
        });
        
        res.status(200).json({
            _id: cart._id,
            user: cart.user,
            items: cart.items.map(item => ({
                _id: item._id,
                product: item.product ? {
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    image: item.product.image
                } : null,
                quantity: item.quantity
            })),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: req.userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        
        res.status(200).json({
            _id: cart._id,
            user: cart.user,
            items: [],
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 