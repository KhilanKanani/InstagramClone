import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import { useNavigate } from 'react-router';
import FindOtherUser from '../FindCurrentData/FindOtherUser';
import { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../main';
import { useEffect } from 'react';
import { IoArrowBackSharp } from 'react-icons/io5';
const OtherUser = () => {

    FindOtherUser();

    const { Otheruser, Userdata } = useSelector(state => state.User);
    const { OnlineUser } = useSelector(state => state.Socket);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [followStates, setFollowStates] = useState({});

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

    const [suggestLoading, setSuggestLoading] = useState(true);

    useEffect(() => {
        const followMap = {};
        Otheruser?.otherUser?.forEach(item => {
            followMap[item._id] = item?.Followers?.includes(Userdata?.user?._id);
        });
        setFollowStates(followMap);
        setSuggestLoading(false);
    }, [Otheruser, Userdata]);


    return (
        <div className="flex w-full h-[100vh] bg-gradient-to-b from-white to-gray-50">
            {/* Sidebar */}
            <div className="lg:w-[17%]">
                <SideBar />
            </div>

            {/* Main */}
            <div className="mt-18 lg:mt-10 lg:w-[83%] w-full h-[92vh] flex flex-col items-center">
                <div className="w-full max-w-xl px-1 flex flex-col gap-3">

                    {/* Title */}
                    <h1 className="font-bold text-[24px] text-gray-800">Suggested Users</h1>

                    {/* Content */}
                    {suggestLoading ? (
                        [...Array(10)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between gap-3 p-3 rounded-lg shadow animate-pulse bg-white border border-gray-200">
                                <div className="flex gap-3 items-center">
                                    <div className="h-11 w-11 rounded-full bg-gray-300" />
                                    <div className="flex flex-col gap-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded" />
                                        <div className="h-3 w-24 bg-gray-100 rounded" />
                                    </div>
                                </div>
                                <div className="h-8 w-20 bg-gray-200 rounded" />
                            </div>
                        ))
                    ) : (
                        Otheruser?.otherUser?.map(user => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-3 rounded-lg shadow-md bg-white hover:shadow-lg transition-all duration-200 border border-gray-200"
                            >
                                {/* Left user info */}
                                <div
                                    className="flex gap-4 items-center cursor-pointer group"
                                    onClick={() => navigate(`/selectProfile/${user._id}`)}
                                >
                                    <div className="relative">
                                        <img
                                            src={user?.Image}
                                            alt={user?.Fullname}
                                            className="h-12 w-12 rounded-full object-cover transition-transform duration-200 group-hover:scale-105 border border-gray-300"
                                        />
                                        {OnlineUser?.includes(user._id) && (
                                            <div className="absolute bottom-0.5 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-semibold text-[15px] text-gray-800 flex items-center gap-1">{user?.Username}
                                            <span>{user?.Username === "Kk's" && <img src="BlueTik.png" className="h-3 w-3" />}</span>
                                        </p>
                                        <p className="text-gray-500 text-sm">{user?.Fullname}</p>
                                    </div>
                                </div>

                                {/* Follow Button */}
                                <button
                                    onClick={() => handleFollowUnfollow(user._id)}
                                    disabled={loading}
                                    className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-all duration-200 ${followStates[user._id]
                                        ? 'bg-gray-200 text-black hover:bg-gray-300'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    {followStates[user._id] ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        ))
                    )}

                    {/* Footer */}
                    <p className="text-gray-400 text-sm text-center lg:mt-5 mt-3 lg:mb-3 mb-20 font-medium">
                        &copy; 2025 - Present Kk's Pvt Ltd.
                    </p>
                </div>
            </div>
        </div>

    )
}

export default OtherUser
