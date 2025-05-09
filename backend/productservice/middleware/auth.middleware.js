const jwt = require('jsonwebtoken');
const axios = require('axios');

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = req.headers['x-user-id'];

        if (!token || !userId) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        // Verify token with auth service
        try {
            const response = await axios.post('http://localhost:5001/api/auth/verify', {
                token,
                userId
            });

            if (response.data.valid) {
                req.user = response.data.user;
                next();
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { verifyToken }; 