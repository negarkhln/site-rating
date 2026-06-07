// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // آدرس APIهای جنگو
});

export const getProducts = () => api.get('products/'); // فراخوانی لیست محصولات
export default api;