import axios from 'axios';

const TOKEN_STORAGE_KEY = 'token';

const api = axios.create({
    baseURL: 'http://localhost:5000/api'
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete api.defaults.headers.common.Authorization;
    }
};

export const logout = () => {
    setAuthToken(null);
};

// interceptor para token (cuando haya login)
api.interceptors.request.use(config => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    return config;
});

export default api;