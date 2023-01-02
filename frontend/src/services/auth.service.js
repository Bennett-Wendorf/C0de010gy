import useUserStore from '../utils/Stores'

import api from '../utils/api'
import jwt from 'jwt-decode'

const AUTH_ENDPOINT_BASE = '/api/auth'

var AuthService = {

    /**
     * Login a new user and update state with their information
     * @param {String} username 
     * @param {String} password 
     */
    login: async (username, password) => {
        return await api.post(AUTH_ENDPOINT_BASE + '/login', { username, password })
            .then((response) => {
                if (response.data.accessToken) {
                    var authedUser = jwt(response.data.accessToken)
                    useUserStore.setState({ UserID: authedUser.id, FullName: response.data.fullName, AccessToken: response.data.accessToken, Roles: response.data.roles ?? [] })
                }
            })
    },

    /**
     * Logout the current user and clear state
     */
    logout: async () => {
        useUserStore.setState({ UserID: -1, AccessToken: -1, FullName: "", Roles: [] })
        api.post(AUTH_ENDPOINT_BASE + '/logout')
            .then((response) => {
                return response.data
            })
    },

    /**
     * Refresh the current user's access token
     */
    fetchRefreshToken: async () => {
        return await api.post(AUTH_ENDPOINT_BASE + '/refresh', { withCredentials: true })
            .then((response) => {
                if (response.data.accessToken) {
                    var authedUser = jwt(response.data.accessToken)
                    useUserStore.setState({ UserID: authedUser.id, FullName: response.data.fullName, AccessToken: response.data.accessToken, Roles: response.data.roles ?? [] })
                }

                return response.data
            })
    },

    /**
     * Check if the current user is logged in
     */
    isLoggedIn: () => {
        return useUserStore.getState().AccessToken !== -1
    },

    /**
     * Check if the current user has the specified permission
     * @param {Array<String>} allowedRoles
     */
    useHasPermissions: (allowedRoles) => {
        const userRoles = useUserStore(state => state.Roles)
        return allowedRoles.some(permission => userRoles.some(role => role.DisplayName === permission))
    },

    isCurrentUser: (userID) => {
        return useUserStore.getState().UserID === userID
    },
}

export default AuthService