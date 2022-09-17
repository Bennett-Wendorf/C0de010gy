import useUserStore from'../utils/Stores'

import api from '../utils/api'
const jwt = require('jwt-decode')

const AUTH_ENDPOINT_BASE = '/api/auth'

var AuthService = {
    login: async (username, password) => {
        console.log(api)
        return await api.post(AUTH_ENDPOINT_BASE + '/login', { username, password })
            .then((response) => {
                if (response.data.accessToken) {
                    var authedUser = jwt(response.data.accessToken)
                    useUserStore.setState({ UserId: authedUser.id, AccessToken: response.data.accessToken })
                }
            })
    }
}

export default AuthService