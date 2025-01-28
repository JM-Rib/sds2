import dotenv from 'dotenv';
dotenv.config();

export const {
    SECRET_JWT_KEY = 'ALKSFJHLkajhsLF38HROWEFUP093ruFOIHDhdkfjhslfhaf8HOWIFdjDJFHSL',
    CLIENT_URL = process.env.CLIENT_URL ? process.env.CLIENT_URL : "http://localhost:3000",
    API_PORT = process.env.API_PORT ? process.env.API_PORT : 5000,
} = process.env;