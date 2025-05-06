import dotenv from 'dotenv';

dotenv.config();

const config = {
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key'
};

export default config;

