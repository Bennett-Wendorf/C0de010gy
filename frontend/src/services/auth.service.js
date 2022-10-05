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
                    useUserStore.setState({ UserId: authedUser.id, AccessToken: response.data.accessToken })
                }
            })
    },
    getUserToken: async () => { //TODO: Check if this gets used
        return useUserStore.getState().AccessToken
    },
    removeUsertoken: async () => {
        useUserStore.setState({ UserID: -1, AccessToken: -1, FullName: "" })
    }
}

export default AuthService