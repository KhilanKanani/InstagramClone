import { createSlice } from "@reduxjs/toolkit";
import FindUser from "../FindCurrentData/FindUser";

const UserSlice = createSlice({
    name: "User",

    initialState: {
        Loading: true,
        Userdata: null,
        Otheruser: null,
        selectProfile: null,
        selectUser: null,
        profileData: null
    },

    reducers: {
        setUserdata: (state, action) => {
            state.Userdata = action.payload;
        },

        setLoading: (state, action) => {
            state.Loading = action.payload;
        },

        setOtheruser: (state, action) => {
            state.Otheruser = action.payload;
        },

        setSelectProfile: (state, action) => {
            state.selectProfile = action.payload;
        },

        setSelectUser: (state, action) => {
            state.selectUser = action.payload;
        },

        setProfileData: (state, action) => {
            state.profileData = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(FindUser.pending, (state) => {
                state.Loading = true
            })

            .addCase(FindUser.fulfilled, (state, action) => {
                state.Userdata = action.payload
                state.Loading = false;
            })

            .addCase(FindUser.rejected, (state) => {
                state.Loading = false;
            });
    }
})

export const { setUserdata, setLoading, setOtheruser, setSelectProfile, setSelectUser, setProfileData } = UserSlice.actions;
export default UserSlice.reducer