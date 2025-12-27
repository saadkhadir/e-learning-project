import axios from 'axios';
import keycloak from '../Keycloak';

const api = axios.create({
    baseURL: 'http://localhost:8081/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// attach token to outgoing requests when available
api.interceptors.request.use(
    (config) => {
        if (keycloak && keycloak.token) {
            config.headers.Authorization = `Bearer ${keycloak.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// try to refresh token on 401 responses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await keycloak.updateToken(30);
                originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;
                return api.request(originalRequest);
            } catch (refreshError) {
                keycloak.login();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
