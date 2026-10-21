export const SERVER_HOST = 'http://localhost:4000'

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        PROFILE: '/api/auth/profile',
        VERIFY_TOKEN: '/api/auth/verify-token',
        UPLOAD_PROFILE_IMAGE: '/api/auth/upload-profile-image'
    },
    PRODUCTS: {
        BASE: '/api/products',
        FEATURED: '/api/products/featured',
        REVIEWS: (id) => `/api/products/${id}/reviews`
    },
    CART: {
        BASE: '/api/cart',
        ADD: '/api/cart/add',
        UPDATE: '/api/cart/update',
        REMOVE: (id) => `/api/cart/remove/${id}`,
        CLEAR: '/api/cart/clear'
    },
    ORDERS: {
        BASE: '/api/orders',
        ADMIN_ALL: '/api/orders/admin/all',
        STATUS: (id) => `/api/orders/${id}/status`
    }
}

export const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    ORDERS: '/orders',
    ORDER_DETAIL: '/orders/:id',
    ADMIN: '/admin',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_USERS: '/admin/users'
}

export const PRODUCT_CATEGORIES = [
    'Architecture',
    'City', 
    'Creator',
    'Friends',
    'Ninjago',
    'Star Wars',
    'Technic',
    'Harry Potter',
    'Marvel',
    'Disney',
    'Ideas',
    'Seasonal'
]

export const ORDER_STATUSES = [
    'pending',
    'confirmed', 
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
]

export const PAYMENT_METHODS = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Stripe' }
]
