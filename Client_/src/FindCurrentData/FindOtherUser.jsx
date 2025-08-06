import axios from "axios";
import { SERVER_URL } from "../main";
import { useDispatch, useSelector } from "react-redux";
import { setOtheruser } from "../Redux/UserSlice";
import { useEffect } from "react";

const FindOtherUser = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        
        const Findotheruser = async () => {
            try {
                const result = await axios.get(`${SERVER_URL}/api/user/otherUser`, { withCredentials: true });
                dispatch(setOtheruser(result.data));
            }

            catch (err) {
                console.log("FindOtherUser Error :", err.message);
            }
        }

        Findotheruser();

    }, [])
}

export default FindOtherUser
