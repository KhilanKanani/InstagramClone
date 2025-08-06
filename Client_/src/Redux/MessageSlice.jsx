import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
    name: "Message",

    initialState: {
        Messages: []
    },

    reducers: {
        setMessages: (state, action) => {
            state.Messages = action.payload;
        },
    }
});

export const { setMessages } = MessageSlice.actions
export default MessageSlice.reducer