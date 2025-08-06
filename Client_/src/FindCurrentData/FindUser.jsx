import axios from "axios";
import { SERVER_URL } from "../main";
import { createAsyncThunk } from "@reduxjs/toolkit";

const FindUser = createAsyncThunk('', async () => {
    try {
        const result = await axios.get(`${SERVER_URL}/api/user/currentUser`, { withCredentials: true });
        return result.data;
    }

    catch (err) {
        console.log('FindUser Error :', err.message);
    }
})

export default FindUser
