import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSavePost } from '../Redux/PostSlice';
import { SERVER_URL } from '../main';

const FindUserSavePost = () => {
    const dispatch = useDispatch();

    useEffect(() => {

        const FindCurrUserSavePost = async () => {
            try {
                const result = await axios.get(`${SERVER_URL}/api/post/userSavedPost`, { withCredentials: true });
                dispatch(setSavePost(result.data.savePost));
            }

            catch (err) {
                console.log("FindOtherUser Error :", err.message);
            }
        }

        FindCurrUserSavePost();

    }, [dispatch])
}

export default FindUserSavePost
