import { useDispatch, useSelector } from 'react-redux'
import SideBar from '../OtherComponent/SideBar'
import { useEffect, useRef, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router';
import { setSelectUser } from '../Redux/UserSlice';
import { IoArrowBackSharp } from "react-icons/io5";
import { RiImageAddLine } from "react-icons/ri";
import { RiImageAddFill } from "react-icons/ri";
import { RiSendPlane2Fill } from "react-icons/ri";
import SendMessage from '../OtherComponent/SendMessage';
import RecieverMessage from '../OtherComponent/RecieverMessage';
import axios from 'axios';
import { SERVER_URL } from '../main';
import { setMessages } from '../Redux/MessageSlice';
import FindUserMessage from '../FindCurrentData/FindUserMessage';
import { BsDot } from 'react-icons/bs';
import { IoIosArrowDown } from "react-icons/io";
import FindOtherUser from '../FindCurrentData/FindOtherUser';

const Messages = () => {

    FindUserMessage();
    FindOtherUser();

    const [toggle, setToggle] = useState(false);
    const [input, setinput] = useState("");
    const [search, setsearch] = useState("");
    const [frontendImage, setfrontendImage] = useState("");
    const [backendImage, setbackendImage] = useState("");
    const { Otheruser, Userdata, selectUser } = useSelector(state => state.User);
    const { Messages } = useSelector(state => state.Message);
    const { Socket, OnlineUser } = useSelector(state => state.Socket);
    const Image = useRef(null);
    const ScrollRef = useRef(null);
    const fallbackUser = JSON.parse(localStorage.getItem("selectedUser"));

    const filterData = Otheruser?.otherUser.filter(item => item?.Fullname.toLowerCase().includes(search.toLowerCase()));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (ScrollRef.current) {
            ScrollRef.current.scrollTop = ScrollRef.current.scrollHeight
        }
    }, [Messages]);

    useEffect(() => {
        if (fallbackUser) {
            dispatch(setSelectUser(fallbackUser));
            localStorage.removeItem("selectedUser");
        }
    }, [fallbackUser]);

    useEffect(() => {
        Socket?.on("newMessage", (data) => {
            dispatch(dispatch(setMessages([...Messages || [], data])));
        })
    }, [Messages]);


    const handleImageUpload = (e) => {
        let image = e.target.files[0];
        setbackendImage(image);
        setfrontendImage(URL.createObjectURL(image));
    }

    const handleSendMessage = async () => {
        try {
            let formData = new FormData();

            formData.append("message", input.trim());

            if (backendImage) {
                formData.append("Image", backendImage)
            }

            const result = await axios.post(`${SERVER_URL}/api/message/sendmsg/${selectUser._id}`, formData, { withCredentials: true });
            dispatch(setMessages([...Messages || [], result?.data?.messages]));

            setinput("");
            setfrontendImage("");
            setbackendImage("");
        }

        catch (err) {
            console.log("SendMessage Error :", err.message);
        }
    }

    const isLoading = !Otheruser?.otherUser;

    return (
        <div className='flex w-[100%] overflow-auto h-[100%]'>

            <div className='w-[17%]'>
                <SideBar />
            </div>

            <div className='w-[50%] h-full' onClick={() => setToggle(false)}>
                {
                    selectUser
                        ? <div className='h-full flex flex-col justify-between'>
                            <div className='fixed z-[10] bg-white pt-5 w-[50%] px-1.5 flex items-center gap-1 border-b-1 border-gray-200 pb-3'>
                                <p onClick={() => dispatch(setSelectUser(null))}><IoArrowBackSharp className='w-6 h-6 cursor-pointer' /></p>
                                <div className='flex gap-3'>
                                    <div className='relative'>
                                        <img src={selectUser?.Image} className="h-11 w-11 rounded-full cursor-pointer" />
                                        {
                                            OnlineUser?.includes(selectUser?._id) &&
                                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                                        }
                                    </div>
                                    <div className='flex flex-col justify-center mt-[-8px]'>
                                        <p className="font-semibold text-[17px]">{selectUser?.Fullname} </p>
                                        <p className=" text-gray-600 text-[15px] mt-[-4px] flex items-center">{selectUser?.Username}</p>
                                    </div>
                                </div>
                            </div>

                            <div ref={ScrollRef} className='h-[82vh] mt-21 flex flex-col p-2 overflow-y-auto scroll-smooth'>
                                {
                                    <div className='flex flex-col gap-3 items-center mt-3 mb-10'>
                                        <img src={selectUser?.Image} className="h-30 w-30 rounded-full border-1 border-gray-300" />

                                        <div className='flex flex-col justify-center items-center'>
                                            <p className='font-semibold text-xl'>{selectUser?.Fullname}</p>
                                            <p className='text-sm opacity-70 flex'>{selectUser?.Username} <span className='mt-[5px]'><BsDot /></span> Kk's</p>
                                        </div>

                                        <div className='flex items-center'>
                                            <button className="bg-gray-200 p-1 hover:bg-gray-300 text-[14px] cursor-pointer px-4 rounded-md font-semibold outline-0" onClick={() => navigate(`/selectProfile/${selectUser?._id}`)}>View Profile</button>
                                        </div>
                                    </div>
                                }
                                {
                                    Array.isArray(Messages) &&
                                    Messages?.length > 0 &&
                                    Messages?.map(msg => (
                                        msg?.sender === Userdata?.user?._id
                                            ? <SendMessage key={msg._id} image={msg.image} text={msg.message} />
                                            : <RecieverMessage key={msg._id} image={msg.image} text={msg.message} />
                                    ))
                                }
                            </div>

                            <div className='px-5 pt-2 pb-5 fixed bottom-0 bg-white w-[50%]'>
                                <input type="file" hidden accept='image/*' ref={Image} onChange={handleImageUpload} />
                                {
                                    frontendImage &&
                                    <img src={frontendImage} className='h-15 w-15 absolute left-9 bottom-15 border-1 border-gray-200 cursor-pointer' onClick={() => window.open(frontendImage, "_blank")} />
                                }
                                <p>{!frontendImage ? <RiImageAddLine className='h-6 w-6 absolute bottom-7 cursor-pointer left-8' onClick={() => Image.current.click()} /> : <RiImageAddFill onClick={() => Image.current.click()} className='h-6 w-6 absolute bottom-7 cursor-pointer left-8' />}</p>
                                <input type="text" value={input} onKeyDown={(e) => e.key == "Enter" && handleSendMessage()} onChange={(e) => { setinput(e.target.value) }} className='border-1 border-gray-300 outline-0 px-12 w-full p-1.5 bg-gray-100 rounded-full' />
                                {
                                    input &&
                                    <p onClick={handleSendMessage}><RiSendPlane2Fill className='h-6 w-6 absolute right-8 bottom-7 cursor-pointer' /></p>
                                }
                                {
                                    frontendImage &&
                                    <p onClick={handleSendMessage}><RiSendPlane2Fill className='h-6 w-6 absolute right-8 bottom-7 cursor-pointer' /></p>
                                }
                            </div>
                        </div>
                        : <div className="flex flex-col items-center justify-center h-[100vh] shadow-inner text-gray-600">
                            <div className="bg-white p-6 rounded-full shadow-md mb-6">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                    alt='Network Error'
                                    className="w-24 h-24"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Welcome to KK's Messenger</h2>
                            <p className="text-gray-500 mb-5 text-center max-w-md">
                                Select a user from the chat list to view messages or start a new conversation. Your messages will appear here.
                            </p>
                            <p className="mt-5 text-sm font-semibold text-gray-400">
                                ©2025 KK's Pvt Ltd. All rights reserved.
                            </p>
                        </div>
                }
            </div>

            <div className='w-[33%] h-full overflow-y-auto scroll-smooth border-l-1 border-gray-200'>
                <div className='pt-8 fixed h-[145px] top-0 z-[10] bg-white w-[33%]' >
                    <div className='px-5  border-b-1 items-center border-gray-200 pb-3 flex gap-1'>
                        <p className='font-bold text-2xl'>{Userdata?.user?.Username}</p>
                        <p><IoIosArrowDown className='w-4 cursor-pointer h-4' onClick={() => setToggle(prev => !prev)} /></p>

                        <div className={`${!toggle ? "hidden" : ""}`}>
                            <button className='bg-gray-200 text-sm outline-0 rounded-lg p-1.5 font-semibold cursor-pointer' onClick={() => navigate("/logout")}>Switch Account</button>
                        </div>
                    </div>

                    <div className='relative px-5 w-full' onClick={() => setToggle(false)}>
                        <span><IoSearch className='h-6 w-6 absolute bottom-5 left-7 cursor-pointer' /></span>
                        <input type="text" value={search} onChange={(e) => setsearch(e.target.value)} className='bg-gray-100 rounded-md mt-3 mb-3 outline-0 py-2 px-11 w-full' placeholder='Search...' />
                        {
                            search &&
                            <span><RxCross2 className='h-6 w-6 absolute bottom-5 right-7 cursor-pointer' onClick={() => setsearch("")} /></span>
                        }
                    </div>
                </div>

                <div className='px-6 pt-37 h-[calc(100vh)] flex flex-col gap-3 bg-white overflow-y-auto'>
                    {
                        isLoading
                            ? [...Array(10)].map((_, index) => (
                                <div key={index} className="flex gap-3 items-center animate-pulse px-2 py-2">
                                    <div className="h-11 w-11 rounded-full bg-gray-300"></div>
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="h-4 w-2/5 bg-gray-300 rounded"></div>
                                        <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))
                            :// Userdata?.user?.Following?.length > 0 ?
                            filterData?.map(item => (
                                // Userdata?.user?.Following?.includes(item?._id) &&
                                <div key={item?._id} className='flex gap-3 cursor-pointer items-center' onClick={() => { dispatch(setSelectUser(item)), setToggle(false), setsearch(""), setinput(""), setfrontendImage(""), setbackendImage("") }}>
                                    <div className='relative'>
                                        <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer" />
                                        {
                                            OnlineUser?.includes(item?._id) &&
                                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                                        }
                                    </div>

                                    <div className='flex flex-col justify-center'>
                                        <p className="font-semibold text-md ">{item?.Fullname} </p>
                                        <p className=" text-gray-600 text-[14px] mt-[-4px] flex items-center">{item?.Username}</p>
                                    </div>
                                </div>
                            ))
                        // :: Following User Is Zero, You Can not Follow Anyone ::
                        // : <div className="flex flex-col gap-8 py-10 overflow-y-auto min-h-[80vh]">
                        //     <div className="text-center">
                        //         <h2 className="text-3xl font-extrabold text-blue-700 px-4">🌟 Discover Popular Creators</h2>
                        //         <p className="text-gray-600 text-base mt-3 max-w-xl mx-auto px-4">
                        //             You're not following anyone yet. Find and follow creators who match your vibe — boost your feed instantly!
                        //         </p>
                        //     </div>

                        //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        //         {
                        //             filterData?.map(item => (
                        //                 <div key={item?._id} onClick={() => navigate(`/selectProfile/${item?._id}`)} className="group relative flex flex-col  bg-white rounded-xl hover:shadow-lg transition-all duration-300 p-3 border border-gray-200 cursor-pointer">
                        //                     <div className="flex items-center gap-3">
                        //                         <div className="relative">
                        //                             <img src={item?.Image} alt={item?.Fullname} className="h-11 w-11 rounded-full " />
                        //                             {
                        //                                 OnlineUser?.includes(item?._id) &&
                        //                                 <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                        //                             }
                        //                         </div>
                        //                         <div>
                        //                             <p className="font-semibold text-gray-800 text-md">{item?.Fullname}</p>
                        //                             <p className="text-sm text-gray-500">{item?.Username}</p>
                        //                         </div>
                        //                     </div>
                        //                 </div>
                        //             ))
                        //         }
                        //     </div>
                        // </div>
                    }

                    {
                        <p className='p-1 mb-5 font-semibold text-gray-300 text-center'>&copy;2025 - Present Kk's Pvt Ltd...</p>
                    }
                </div>
            </div>
        </div >
    )
}

export default Messages
