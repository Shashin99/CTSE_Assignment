import Cart from '../models/Cart.js';
import Product from '../../productservice/models/Product.js';

// Get user's cart
export const getCart = async (req, res) => {
    try {
        console.log('Getting cart for user:', req.user);
        
        // Get user ID from either the decoded token or the X-User-ID header
        const userId = req.user?.userId || req.headers['x-user-id'];
        
        if (!userId) {
            console.log('No user ID found in request');
            return res.status(401).json({ message: 'User ID not found' });
        }

        console.log('Looking for cart with user ID:', userId);
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price image');
        
        if (!cart) {
            console.log('No cart found, returning empty cart');
            return res.status(200).json({ items: [] });
        }
        
        console.log('Cart found:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user?.userId || req.headers['x-user-id'];
        const { productId, quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({
                user: userId,
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
        await cart.populate('items.product', 'name price image');
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.userId || req.headers['x-user-id'];
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product', 'name price image');
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.userId || req.headers['x-user-id'];
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('items.product', 'name price image');
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const userId = req.user?.userId || req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).json({ message: 'User ID not found' });
        }

        const cart = await Cart.findOne({ user: userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 