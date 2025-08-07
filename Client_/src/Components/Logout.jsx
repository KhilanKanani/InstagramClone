import axios from "axios";
import { SERVER_URL } from "../main";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { setLoading, setOtheruser, setProfileData, setSelectProfile, setSelectUser, setUserdata } from "../Redux/UserSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setPost, setSavePost, setSelectPost, setSelectUserPost, setUserPost } from "../Redux/PostSlice";
import { setMessages } from "../Redux/MessageSlice";
import { setOnlineUser } from "../Redux/SocketSlice";

const Logout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        async function handleLogout() {
            try {
                dispatch(setLoading(true))
                await axios.get(`${SERVER_URL}/api/auth/logout`, { withCredentials: true });
                dispatch(setLoading(false));
                
                dispatch(setUserdata(null));
                dispatch(setSelectUser(null));
                dispatch(setOtheruser(null));
                dispatch(setSelectProfile(null));

                dispatch(setPost(null));
                dispatch(setUserPost(null));
                dispatch(setSelectUserPost(null));
                dispatch(setSelectPost(null));
                
                dispatch(setMessages(null));
                dispatch(setProfileData(null));
                dispatch(setSavePost(null));
                dispatch(setOnlineUser(null));

                toast.success("Logout Successfull...");
                navigate("/login"); 
            }

            catch (err) {
                console.log("Logout Error :", err.message);
            }
        }

        handleLogout();
    }, [dispatch])

}

export default Logout
