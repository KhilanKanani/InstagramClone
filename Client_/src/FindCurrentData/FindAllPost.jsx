import axios from 'axios';
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { SERVER_URL } from '../main';
import { setPost } from '../Redux/PostSlice';

const   FindAllPost = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const result = await axios.get(`${SERVER_URL}/api/post/allpost`, { withCredentials: true });
                dispatch(setPost(result.data));
            }

            catch (err) {
                console.log("FindUserAllPost Error :", err.message);
            }
        }

        fetchAllPost();
    }, [dispatch]);
}

export default FindAllPost
