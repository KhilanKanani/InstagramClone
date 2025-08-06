import { createSlice } from "@reduxjs/toolkit";

const SocketSlice = createSlice({
    name: "Socket",

    initialState: {
        Socket: null,
        OnlineUser: null,
        Notification: []
    },

    reducers: {
        setSocket: (state, action) => {
            state.Socket = action.payload;
        },

        setOnlineUser: (state, action) => {
            state.OnlineUser = action.payload;
        },

        setNotification: (state, action) => {
            if (action.payload.type == "Like") {
                state.Notification.push(action.payload);
            }
            else if (action.payload.type == "DisLike") {
                state.Notification = state.Notification.filter(item => item.userId !== action.payload.userId);
            }
        },
    }
});

export const { setSocket, setOnlineUser, setNotification } = SocketSlice.actions
export default SocketSlice.reducer