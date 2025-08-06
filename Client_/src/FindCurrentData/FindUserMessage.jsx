import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SERVER_URL } from '../main';
import { setMessages } from '../Redux/MessageSlice';

const FindUserMessage = () => {
    const dispatch = useDispatch();
    const { selectUser } = useSelector(state => state.User);

    useEffect(() => {
        const fetchAllMessages = async () => {
            try {
                if (selectUser) {
                    const result = await axios.get(`${SERVER_URL}/api/message/getmsg/${selectUser._id}`, { withCredentials: true });
                    dispatch(setMessages(result?.data?.messages));
                }
            }

            catch (err) {
                console.log("FindUserMesssage Error :", err.message);
            }
        }

        fetchAllMessages();
    }, [selectUser]);
}

export default FindUserMessage
