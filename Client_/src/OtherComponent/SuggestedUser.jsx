import { useSelector } from 'react-redux';
import SideBar from './SideBar';
import { useNavigate } from 'react-router';
import FindOtherUser from '../FindCurrentData/FindOtherUser';
import { useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../main';
import { useEffect } from 'react';
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
        <div className="flex w-[100%] h-[100%] ">
            <div className="w-[17%]">
                <SideBar />
            </div>

            <div className="mt-20 mb-5 w-[83%] h-full flex flex-col items-center">
                <div className='h-[100%] flex flex-col gap-4 w-[45%]'>

                    <div>
                        <h1 className="font-semibold text-[22px] mb-3">Suggested User</h1>
                    </div>

                    {
                        suggestLoading
                            ? [...Array(12)].map((_, index) => (
                                <div key={index} className="flex justify-between items-center animate-pulse">
                                    <div className="flex gap-3">
                                        <div className="h-11 w-11 bg-gray-300 rounded-full"></div>
                                        <div className="flex flex-col justify-center gap-2">
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-24 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                                </div>
                            ))
                            : Otheruser?.otherUser?.length > 0 && Otheruser?.otherUser?.map(item => (
                                <div key={item._id} className='flex justify-between items-center' >
                                    <div className='flex gap-3 cursor-pointer' onClick={() => { navigate(`/selectProfile/${item._id}`) }}>
                                        <div className='relative'>
                                            <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer" />
                                            {
                                                OnlineUser?.includes(item?._id)
                                                && <div className='absolute bottom-0.5 right-0 bg-green-600 h-2.5 w-2.5 rounded-full'></div>
                                            }
                                        </div>
                                        <div className='flex flex-col justify-center'>
                                            <p className="font-semibold text-md">{item?.Username}</p>
                                            <p className="text-gray-600 text-[14px] mt-[-4px]">{item?.Fullname}</p>
                                        </div>
                                    </div>

                                    <button onClick={() => handleFollowUnfollow(item?._id)} disabled={loading}>
                                        {
                                            followStates[item._id]
                                                ? <p className="text-black px-3 bg-gray-200 py-1 cursor-ointer rounded-md font-semibold outline-0 cursor-pointer">Following</p>
                                                : <p className="bg-blue-500  hover:bg-blue-600 text-white cursor-ointer py-1 px-4 rounded-md font-semibold outline-0 cursor-pointer">Follow</p>
                                        }
                                    </button>
                                </div>
                            ))
                    }

                    <div>
                        <p className='font-semibold text-gray-300 text-sm text-center'>&copy;2025 - Present Kk's Pvt Ltd...</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OtherUser
