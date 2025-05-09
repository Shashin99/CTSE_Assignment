require('dotenv').config();

module.exports = {
    port: process.env.PORT || 5004,
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://CTSE:CTSE@ctse.kewjrct.mongodb.net/productservice?retryWrites=true&w=majority&appName=CTSE',
    authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:5001',
    uploadDir: process.env.UPLOAD_DIR || 'uploads'
};

