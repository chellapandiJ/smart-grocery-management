import axios from 'axios';

const instance = axios.create({
    baseURL: '/api'
});

// Add Interceptor for Token
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Optional: Global 401 Handler to clear stale token without console spamming if possible
// Note: You can't prevent the 'Failed to load resource' browser log easily, 
// but you can ensure the app reacts by clearing local state.
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If the profile fetch fails with 401, it means the token is stale
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

const api = {
    auth: {
        login: (credentials) => instance.post('/auth/login', credentials),
        register: (userData) => instance.post('/auth/register', userData),
        forgotPassword: (data) => instance.post('/auth/forgot-password', data),
        getProfile: () => instance.get('/auth/profile'),
        getStaff: () => instance.get('/auth/staff'),
        addStaff: (data) => instance.post('/auth/staff', data),
        getCustomers: () => instance.get('/auth/customers'),
        updateUser: (id, data) => instance.put(`/auth/users/${id}`, data),
        deleteUser: (id) => instance.delete(`/auth/users/${id}`),
    },
    product: {
        getAll: () => instance.get('/products'),
        getCategories: () => instance.get('/products/categories'),
        create: (formData) => instance.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        update: (id, formData) => instance.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        delete: (id) => instance.delete(`/products/${id}`),
        createCategory: (data) => instance.post('/products/categories', data),
        updateCategory: (id, data) => instance.put(`/products/categories/${id}`, data),
        deleteCategory: (id) => instance.delete(`/products/categories/${id}`),
    },
    cart: {
        get: () => instance.get('/cart'),
        add: (data) => instance.post('/cart', data),
        update: (id, data) => instance.put(`/cart/${id}`, data),
        remove: (id) => instance.delete(`/cart/${id}`),
    },
    order: {
        create: (orderData) => instance.post('/orders', orderData),
        getMyOrders: () => instance.get('/orders/my-orders'),
    },
    admin: {
        getStats: () => instance.get('/admin/stats'),
        getInventoryStatus: () => instance.get('/inventory/status'),
        getStockLogs: () => instance.get('/inventory/logs'),
        getFlowAnalytics: (params) => instance.get('/admin/inventory/flow-analytics', { params }),
        getReports: (params) => instance.get('/admin/reports', { params }),
        getAllOrders: () => instance.get('/orders/all'),
        updateOrderStatus: (id, data) => instance.put(`/orders/${id}/status`, data),
    },
    discount: {
        getAll: () => instance.get('/discounts'),
        add: (data) => instance.post('/discounts', data),
        delete: (id) => instance.delete(`/discounts/${id}`),
    }
};

export default api;
