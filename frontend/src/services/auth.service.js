import useUserStore from '../utils/Stores'

import api from '../utils/api'
import jwt from 'jwt-decode'

const AUTH_ENDPOINT_BASE = '/api/auth'

var AuthService = {
    login: async (username, password) => {
        return await api.post(AUTH_ENDPOINT_BASE + '/login', { username, password })
            .then((response) => {
                if (response.data.accessToken) {
                    var authedUser = jwt(response.data.accessToken)
                    useUserStore.setState({ UserID: authedUser.id, FullName: response.data.fullName, AccessToken: response.data.accessToken, Roles: response.data.roles ?? [] })
                }
            })
    },

    logout: async () => {
        useUserStore.setState({ UserID: -1, AccessToken: -1, FullName: "", Roles: [] })
        api.post(AUTH_ENDPOINT_BASE + '/logout')
            .then((response) => {
                return response.data
            })
    },

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

    isLoggedIn: () => {
        return useUserStore.getState().AccessToken !== -1
    },

    useHasPermissions: (allowedRoles) => {
        const userRoles = useUserStore(state => state.Roles)
        return allowedRoles.some(permission => userRoles.some(role => role.DisplayName === permission))
    }
}

export default AuthService