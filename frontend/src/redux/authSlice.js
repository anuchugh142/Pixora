import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        toggleFollowing: (state, action) => {
            const userId = action.payload;
            if (state.user?.following.includes(userId)) {
                // If already following, remove from following list
                state.user.following = state.user.following.filter(id => id !== userId);
            } else {
                // If not following, add to following list
                state.user.following.push(userId);
            }
        }
    }
});

export const {
    setSuggestedUsers,
    setAuthUser,
    setUserProfile,
    setSelectedUser,
    toggleFollowing
} = authSlice.actions;

export default authSlice.reducer;