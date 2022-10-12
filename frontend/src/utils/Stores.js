import create from 'zustand'

// Create a zustand store for global state management
const useUserStore = create((set, get) => ({
    UserID: -1,
    FullName: "",
    AccessToken: -1,
    Roles: [],

    setAuthenticatedUser: (userID, fullName, accessToken, roles) => set({ 
            UserID: userID,
            FullName: fullName,
            AccessToken: accessToken,
            Roles: roles
        }),

    setAccessToken: (newAccessToken) => set({ AccessToken: newAccessToken }),
}))

export default useUserStore