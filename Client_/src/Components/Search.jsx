import { useState } from 'react'
import SideBar from '../OtherComponent/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { BsDot } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { SERVER_URL } from '../main';
import { setSelectProfile } from '../Redux/UserSlice';
import { useNavigate } from 'react-router';
import millify from 'millify';
import FindOtherUser from '../FindCurrentData/FindOtherUser';

const Search = () => {

    FindOtherUser();

    const [input, setinput] = useState("");
    const { Otheruser } = useSelector(state => state.User);
    const { OnlineUser } = useSelector(state => state.Socket);
    const filterData = Otheruser?.otherUser?.filter(item => item.Username?.toLowerCase().includes(input.toLowerCase()));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSelectProfile = async (id) => {
        try {
            const result = await axios.get(`${SERVER_URL}/api/user/getProfile/${id}`, { withCredentials: true });
            dispatch(setSelectProfile(result.data));
        }

        catch (err) {
            console.log("SelectProfileError :", err.message);
        }
    }

    const isLoading = !Otheruser?.otherUser;

    return (
        <div className='flex lg:w-[100%] h-[100%] mb-5'>

            <div className='lg:w-[17%]'>
                <SideBar />
            </div>

            <div className='flex flex-col justify-center lg:w-[83%] lg:mt-10 mb-13 px-1 w-full bg-white'>

                <div className='fixed top-0 w-full z-[20] bg-white'>
                    <h1 className='lg:px-50 sm:px-20 bg-white w-full lg:pt-10 pt-18 pb-2 font-bold text-2xl z-[10]'>🔍 Search</h1>

                    <div className='lg:w-[70%] relative w-full pt-2 pb-2 bg-white flex items-center lg:px-50 sm:px-20 z-[10]'>
                        <span><IoSearch className='h-6.5 w-6.5 absolute bottom-4 lg:left-52 sm:left-22 left-2 cursor-pointer' /></span>
                        <input type="text" value={input} onChange={(e) => setinput(e.target.value)} className='border-1 border-gray-300 mr-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all bg-gray-100 rounded-full outline-0 py-2 px-11 w-full' placeholder='Search User...' />
                        {
                            input &&
                            <span><RxCross2 className='h-6.5 w-6.5 absolute bottom-4 lg:right-54.5 sm:right-25 right-5 cursor-pointer' onClick={() => setinput("")} /></span>
                        }
                    </div>
                </div>

                <div className='lg:px-50 sm:px-20 flex flex-col gap-3 lg:mt-25 mt-43 bg-white'>
                    {
                        isLoading
                            ? [...Array(10)].map((_, index) => (
                                <div key={index} className='flex items-center gap-3 animate-pulse'>
                                    <div className='h-11 w-13 bg-gray-300 rounded-full'></div>
                                    <div className='flex flex-col gap-2 w-full'>
                                        <div className='h-4 w-1/3 bg-gray-300 rounded'></div>
                                        <div className='h-3 w-1/2 bg-gray-200 rounded'></div>
                                    </div>
                                </div>
                            ))
                            : filterData?.length > 0
                                ? filterData?.map(item => (
                                    <div key={item._id} className='lg:w-[75%] flex justify-between items-center'>
                                        <div className='flex gap-3 cursor-pointer hover:bg-gray-200 rounded-md p-1.5 w-full' onClick={() => { handleSelectProfile(item._id); navigate(`/selectProfile/${item._id}`) }}>
                                            <div className='relative'>
                                                <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer" />
                                                {
                                                    OnlineUser?.includes(item?._id) &&
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                                                }
                                            </div>

                                            <div className='flex flex-col justify-center'>
                                                <p className="font-semibold text-md flex items-center gap-1">{item?.Username} <span>{item?.Username === "Kk's" && <img src="BlueTik.png" className="h-3 w-3" />}</span></p>
                                                <p className="text-gray-600 text-[14px] mt-[-4px] flex items-center">
                                                    {item?.Fullname} <BsDot className='mb-[-2px]' /> {item?.Followers?.length && millify(item?.Followers?.length)} Followers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))

                                : <p className="ml-3 text-gray-500 text-md font-medium">
                                    No users found
                                </p>
                    }
                </div>
            </div>
        </div>
    )
}

export default Search
