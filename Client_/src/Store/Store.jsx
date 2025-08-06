import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "../Redux/UserSlice"
import PostSlice from "../Redux/PostSlice"
import MessageSlice from "../Redux/MessageSlice"
import SocketSlice from "../Redux/SocketSlice"

const Store = configureStore({
    reducer: {
        User: UserSlice,
        Post: PostSlice,
        Message: MessageSlice,
        Socket: SocketSlice
    }
})

export default Store