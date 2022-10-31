import axios from "axios"
import AuthService from "../../services/auth.service";
import useUserStore from "../Stores";

// Setup the base url to the backend server
const baseUrl = "/";

// Export the axios component with some basic headers and base url defined above
const api = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use(
    config => {
        const token = useUserStore.getState().AccessToken;
        if (token) {
            config.headers["Authorization"] = "Bearer:" + token
        }
        return config
    },
    error => {
        Promise.reject(error)
    }
);

api.interceptors.response.use(
    response => {
        return response
    },
    async error => {
        const originalRequest = error.config;

        // Don't bother retrieving a new token if an invalid login caused the 401 response
        if (
            originalRequest.url !== "/api/auth/login" &&
            originalRequest.url !== "/api/auth/refresh" &&
            error.response
        ) {
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
               return await AuthService.fetchRefreshToken()
                    .then(res => {
                        const token = res.accessToken
                        useUserStore.setState({ AccessToken: token })
                        return api(originalRequest)
                    })
                    .catch(err => {
                        if (err.response.status === 401) {
                            AuthService.logout()
                            return Promise.reject(err)
                        }
                    }
                )
            }
            return Promise.reject(error);
        }
        return Promise.reject(error);
    }
);

export default api;