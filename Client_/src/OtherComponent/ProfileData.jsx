import { useDispatch, useSelector } from 'react-redux'
import SideBar from './SideBar'
import { IoArrowBackSharp } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { setProfileData } from '../Redux/UserSlice';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../main';

const ProfileData = () => {

    const { profileData, Userdata } = useSelector(state => state.User);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const location = useLocation();
    const selectedTabFromNav = location.state?.selectedTab;
    const [profileLoading, setProfileLoading] = useState(true);
    const [select, setselect] = useState(selectedTabFromNav || "Followers");
    const fallbackUser = localStorage.getItem("select") || "Followers";

    useEffect(() => {
        setselect(fallbackUser);
        localStorage.removeItem("select");
    }, [selectedTabFromNav]);

    const [loading, setLoading] = useState(false);
    const [followStates, setFollowStates] = useState({});

    useEffect(() => {
        if (profileData?.user?.Following) {
            const map = {};
            profileData.user.Following.forEach(item => {
                map[item._id] = Userdata.user.Following.includes(item._id);
            });
            setFollowStates(map);
        }
    }, [profileData, Userdata]);

    const handleFollowUnfollow = async (id) => {
        try {
            setLoading(true);
            await axios.post(`${SERVER_URL}/api/user/followOrUnfollow/${id}`, {}, { withCredentials: true });
            setFollowStates(prev => ({ ...prev, [id]: !prev[id] }));
            setLoading(false);
        }

        catch (err) {
            setLoading(false);
            console.log("FollowUnfollow Error :", err.message);
        }
    }

    const handleProfileData = async () => {
        try {
            setProfileLoading(true);
            const result = await axios.get(`${SERVER_URL}/api/user/userprofiledata/${id}`, { withCredentials: true });
            dispatch(setProfileData(result.data));
            setProfileLoading(false);
        }

        catch (err) {
            console.log("ProfileData Error :", err.message);
            setProfileLoading(false);

        }
    }

    useEffect(() => {
        handleProfileData();
    }, [id]);

    if (profileLoading) {
        return (
            <div className="flex w-full h-full">
                <div className="lg:w-[17%]">
                    <SideBar />
                </div>

                <div className="lg:w-[83%] w-full lg:px-80 px-1 lg:pt-10 pt-18 mb-18">
                    <div className="animate-pulse space-y-5">
                        <div className='flex gap-2'>
                            <div className="h-6 bg-gray-300 rounded-full w-6 mb-3"></div>
                            <div className="h-6 bg-gray-300 rounded w-20 mb-3"></div>
                        </div>

                        <div className="flex items-center justify-center lg:gap-10 gap-5 mt-7">
                            <div className="h-4 w-24 bg-gray-300 rounded"></div>
                            <div className="h-4 w-24 bg-gray-300 rounded"></div>
                        </div>

                        <hr className='text-gray-300 mt-5'/>

                        <div className="mt-5 space-y-5">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex items-center justify-between gap-4">
                                    <div className='flex lg:gap-4 gap-3 w-full items-center'>
                                        <div className="h-11 w-14 bg-gray-300 rounded-full"></div>
                                        <div className="w-full">
                                            <div className="h-3 lg:w-40 max-w-30 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 lg:w-32 max-w-30 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>

                                    <div className="h-7 lg:w-40 w-30 bg-gray-200 rounded mb-2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex w-[100%] h-[100vh]'>

            <div className='lg:w-[17%]'>
                <SideBar />
            </div>

            <div className='lg:w-[83%] w-full xl:px-80 lg:px-50 md:px-40 sm:px-20 px-1 pb-15 lg:pb-5 overflow-auto scroll-smooth'>
                <div className=''>
                    <div className='flex bg-white lg:top-0 top-10 z-[10] w-full pt-10 pb-5 items-center lg:gap-3 gap-1.5 fixed'>
                        <IoArrowBackSharp className='text-[22px] mt-[2px] cursor-pointer' onClick={() => Userdata?.user?._id === id ? navigate("/profile") : navigate(`/selectprofile/${id}`)} />
                        <p className='font-bold text-2xl'>{profileData?.user?.Username}</p>
                    </div>

                    <div className="mt-23 lg:mt-10 lg:pt-15 pt-10 border-gray-300 border-b-1 flex lg:gap-20 gap-10 justify-center">
                        <p className={`flex gap-1 pb-3 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Followers" ? "border-b-1 font-semibold opacity-100 mb-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Followers") }}> <span>{profileData?.user?.Followers.length}</span> Followers</p>
                        <p className={`flex gap-1 pb-3 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Following" ? "border-b-1 font-semibold opacity-100 mb-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Following") }}> <span>{profileData?.user?.Following.length}</span> Following</p>
                    </div>
                </div>

                {
                    select === "Followers" &&
                    <div>
                        {profileData?.user?.Followers.length > 0
                            ? profileData?.user?.Followers.map((item, index) => (
                                <div key={index} className='flex items-center justify-between gap-3 mt-5 mb-3'>
                                    <div className='flex gap-3 cursor-pointer' onClick={() => { item?._id == Userdata?.user?._id ? navigate("/profile") : navigate(`/selectProfile/${item._id}`) }}>
                                        <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer" />

                                        <div className='flex flex-col justify-center'>
                                            <p className="font-semibold text-md">{item?.Username}</p>
                                            <p className="text-gray-600 text-[14px] mt-[-4px]">{item?.Fullname}</p>
                                        </div>
                                    </div>

                                    {
                                        item._id === Userdata?.user?._id
                                            ? <button onClick={() => navigate("/profile")} className=' text-sm text-black cursor-pointer py-1.5 px-1.5 border-1 border-gray-300 bg-gray-100 rounded-md font-semibold outline-0'>
                                                See Profile
                                            </button>

                                            : <button disabled={loading}>
                                                {
                                                    followStates[item._id]
                                                        ? <p onClick={() => { localStorage.setItem("selectedUser", JSON.stringify(item)); navigate("/message") }} className="text-black px-3 bg-gray-200 py-1 rounded-md font-semibold outline-0 cursor-pointer">Message</p>
                                                        : <p onClick={() => handleFollowUnfollow(item?._id)} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4.5 rounded-md font-semibold outline-0 cursor-pointer">Follow</p>
                                                }
                                            </button>

                                    }
                                </div>
                            ))

                            : <p className=' mt-5 text-center font-semibold text-gray-400'>No Followers</p>
                        }
                    </div>
                }

                {
                    select === "Following" &&
                    <div>
                        {
                            profileData?.user?.Following.length > 0
                                ? profileData?.user?.Following.map((item, index) => (
                                    <div key={index} className=' flex items-center justify-between mt-5 gap-3 mb-3'>
                                        <div className='flex gap-3 cursor-pointer' onClick={() => { item?._id == Userdata?.user?._id ? navigate("/profile") : navigate(`/selectProfile/${item._id}`) }}>
                                            <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer" />

                                            <div className='flex flex-col justify-center'>
                                                <p className="font-semibold text-md">{item?.Username}</p>
                                                <p className="text-gray-600 text-[14px] mt-[-4px]">{item?.Fullname}</p>
                                            </div>
                                        </div>

                                        {
                                            item._id === Userdata?.user?._id
                                                ? <button onClick={() => navigate("/profile")} className=' text-sm text-black cursor-pointer py-1.5 px-1.5 border-1 border-gray-300 bg-gray-100 rounded-md font-semibold outline-0'>
                                                    See Profile
                                                </button>

                                                : <button onClick={() => handleFollowUnfollow(item?._id)} disabled={loading}>
                                                    {
                                                        followStates[item._id]
                                                            ? <p className="text-red-400 px-3 text-sm bg-red-100 rounded-md py-1.5 cursor-ointer font-semibold outline-0 cursor-pointer">Unfollow</p>
                                                            : <p className="bg-blue-500  hover:bg-blue-600 text-white cursor-ointer py-1 px-4 rounded-md font-semibold outline-0 cursor-pointer">Follow</p>

                                                    }
                                                </button>
                                        }
                                    </div>
                                ))

                                : <p className='mt-5 text-center font-semibold text-gray-400'>Not Following Anyone</p>
                        }
                    </div>
                }
            </div>

        </div>
    )
}

export default ProfileData
