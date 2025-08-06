import { createSlice } from "@reduxjs/toolkit";

const PostSlice = createSlice({
    name: "Post",

    initialState: {
        Post: [],
        Userpost: [],
        SelectUserPost: [],
        SelectPost: null,
        SavePost: [],
    },

    reducers: {
        setPost: (state, action) => {
            state.Post = action.payload;
        },

        setUserPost: (state, action) => {
            state.Userpost = action.payload;
        },

        setSelectUserPost: (state, action) => {
            state.SelectUserPost = action.payload;
        },

        setSelectPost: (state, action) => {
            state.SelectPost = action.payload;
        },

        setSavePost: (state, action) => {
            state.SavePost = action.payload;
        }
    },
})

export const { setPost, setUserPost, setSelectUserPost, setSelectPost, setSavePost } = PostSlice.actions;
export default PostSlice.reducer