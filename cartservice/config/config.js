import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 5003,
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://CTSE:CTSE@ctse.kewjrct.mongodb.net/cartservice?retryWrites=true&w=majority&appName=CTSE',
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    productServiceUrl: process.env.PRODUCT_SERVICE_URL || 'http://localhost:5004',
    userServiceUrl: process.env.USER_SERVICE_URL || 'http://localhost:5002'
};

export default config; 