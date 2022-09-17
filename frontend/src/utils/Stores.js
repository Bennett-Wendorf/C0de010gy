import create from 'zustand'

// Create a zustand store for global state management
const useUserStore = create(set => ({
    UserID: -1,
    FullName: "",
    AccessToken: -1,
    setAuthenticatedUser: (userID, fullName, accessToken) => set({ 
            UserID: userID,
            FullName: fullName,
            AccessToken: accessToken
        }),
    setAccessToken: (newAccessToken) => set({ AccessToken: newAccessToken })
}))

export default useUserStore