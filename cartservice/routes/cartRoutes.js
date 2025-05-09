import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';
import verifyToken from '../../userservice/middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Cart routes
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router; 