// import { createSlice } from "@reduxjs/toolkit";

// const rtnSlice = createSlice({
//     name: 'realTimeNotification',
//     initialState: {
//         likeNotification: [], // Stores all notifications
//     },
//     reducers: {
//         setLikeNotification: (state, action) => {
//             if (action.payload.type === 'like') {
//                 state.likeNotification.push(action.payload);
//             } else if (action.payload.type === 'dislike') {
//                 state.likeNotification = state.likeNotification.filter(item => item.userId !== action.payload.userId);
//             }
//         },
//         removeNotification: (state, action) => {
//             state.likeNotification = state.likeNotification.filter(item => item.userId !== action.payload);
//         },
//         clearNotifications: (state) => {
//             state.likeNotification = [];
//         }
//     }
// });

// export const { setLikeNotification, removeNotification, clearNotifications } = rtnSlice.actions;
// export default rtnSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        likeNotification: [], // Stores all like notifications
    },
    reducers: {
        setLikeNotification: (state, action) => {
            if (action.payload.type === 'like') {
                state.likeNotification.push(action.payload);
            } else if (action.payload.type === 'dislike') {
                // Remove only the notification related to the specific post
                state.likeNotification = state.likeNotification.filter(
                    notification => !(notification.userId === action.payload.userId && notification.postId === action.payload.postId)
                );
            }
        },
        removeNotification: (state, action) => {
            state.likeNotification = state.likeNotification.filter(notification => notification.userId !== action.payload);
        },
        clearNotifications: (state) => {
            state.likeNotification = [];
        }
    }
});

export const { setLikeNotification, removeNotification, clearNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;