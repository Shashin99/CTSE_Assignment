import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const auth = (req, res, next) => {
    try {
        console.log('Auth middleware - Headers:', req.headers);
        const authHeader = req.header('Authorization');
        console.log('Auth middleware - Auth Header:', authHeader);
        
        if (!authHeader) {
            console.log('Auth middleware - No auth header found');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('Auth middleware - Extracted token:', token ? 'Token exists' : 'No token');
        
        if (!token) {
            console.log('Auth middleware - No token after extraction');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            console.log('Auth middleware - Verifying token with secret:', config.JWT_SECRET);
            const decoded = jwt.verify(token, config.JWT_SECRET);
            console.log('Auth middleware - Token decoded successfully:', decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Auth middleware - Token verification error:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth middleware - General error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
}; 