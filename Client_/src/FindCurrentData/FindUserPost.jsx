import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SERVER_URL } from '../main';
import { setUserPost } from '../Redux/PostSlice';

const FindUserPost = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserPost = async () => {
            try {
                const result = await axios.get(`${SERVER_URL}/api/post/userpost`, { withCredentials: true });
                dispatch(setUserPost(result.data));
            }

            catch (err) {
                console.log("FindUserAllPost Error :", err.message);
            }
        }

        fetchUserPost();
    }, [dispatch]);
}

export default FindUserPost
