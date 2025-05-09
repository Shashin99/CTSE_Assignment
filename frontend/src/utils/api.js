import axios from 'axios';
import config from '../config/config';

// Create axios instances for each service
const authApi = axios.create({
    baseURL: config.AUTH_SERVICE_URL
});

const userApi = axios.create({
    baseURL: config.USER_SERVICE_URL
});

const productApi = axios.create({
    baseURL: config.PRODUCT_SERVICE_URL
});

const cartApi = axios.create({
    baseURL: config.CART_SERVICE_URL
});

// Add request interceptor to add auth token
const addAuthToken = (config) => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (userData) {
        config.headers['X-User-ID'] = userData._id;
    }
    
    return config;
};

[authApi, userApi, productApi, cartApi].forEach(api => {
    api.interceptors.request.use(addAuthToken);
});

export { authApi, userApi, productApi, cartApi }; 