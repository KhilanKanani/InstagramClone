import { useEffect, useState } from 'react'
import SideBar from './SideBar'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import { SERVER_URL } from '../main';
import { setSelectPost } from '../Redux/PostSlice';
import { LuSend } from "react-icons/lu";
import { IoMenu } from 'react-icons/io5';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { RiSaveFill, RiSaveLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { setMessages } from '../Redux/MessageSlice';
import FindOtherUser from '../FindCurrentData/FindOtherUser';

const ShowSelectPost = () => {

    FindOtherUser();

    const { Userdata, Otheruser } = useSelector(state => state.User);
    const { SelectPost } = useSelector(state => state.Post);
    const { OnlineUser } = useSelector(state => state.Socket);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [sendLoading, setSendLoading] = useState(false);
    const [selectedReceiver, setSelectedReceiver] = useState({});
    const [sendInput, setSendInput] = useState("");
    const [sendToggle, setSendToggle] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [like, setlike] = useState(false);
    const [postLikeCount, setPostlikeCount] = useState(0);
    const [save, setsave] = useState(false);
    const [select, setselect] = useState(false);
    const [loading, setloading] = useState(false);
    const [followloading, setfollowloading] = useState(false);
    const [follow, setfollow] = useState(false);
    const [followStates, setFollowStates] = useState({});
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const followMap = {};
        Otheruser?.otherUser?.forEach(item => {
            followMap[item._id] = item?.Followers?.includes(Userdata?.user?._id);
        });
        setFollowStates(followMap);
    }, [Otheruser, Userdata, SelectPost]);


    const handleSendPost = async (receiverId, imageUrl) => {
        try {
            if (!receiverId) {
                toast.error("Please select a receiver");
                return;
            }

            setSendLoading(true);
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const filename = imageUrl.split('/').pop();
            const file = new File([blob], filename, { type: blob.type });

            const formData = new FormData();
            formData.append('Image', file);
            formData.append("message", sendInput);

            const result = await axios.post(`${SERVER_URL}/api/message/sendmsg/${receiverId}`, formData, { withCredentials: true });

            if (result.data.success) {
                toast.success("Post Sent Successfully");
                dispatch(setMessages(prev => [...prev, result.data.messages]));
                setSendToggle(false);
            } else {
                setSendLoading(false);
                toast.error("Failed to send post");
            }
            setSendInput("");
            setSendLoading(false);
        }

        catch (err) {
            console.log("SendPost Error:", err.message);
            toast.error("Failed to send post");
            setSendLoading(false);
        }
    }

    const handleFollowUnfollow = async (id) => {
        try {
            setfollowloading(true);
            await axios.post(`${SERVER_URL}/api/user/followOrUnfollow/${id}`, {}, { withCredentials: true });

            if (!follow) {
                setfollow(true);
            }
            else {
                setfollow(false);
            }
            setfollowloading(false);
        }

        catch (err) {
            setfollowloading(false);
            console.log("FollowUnfollow Error :", err.message);
        }
    }

    useEffect(() => {
        setfollow(SelectPost?.Author?.Followers?.includes(Userdata?.user?._id));
    }, [SelectPost, Userdata]);

    const handleToggleLike = async () => {
        const isLiked = like;
        setlike(!isLiked);
        setPostlikeCount(prev => isLiked ? prev - 1 : prev + 1);

        if (isLiked) {
            await axios.get(`${SERVER_URL}/api/post/unlikepost/${id}`, { withCredentials: true });
        }
        else {
            await axios.get(`${SERVER_URL}/api/post/likepost/${id}`, { withCredentials: true });
        }
    };

    const handleSavePost = async () => {
        try {
            const result = await axios.post(`${SERVER_URL}/api/post/savepost/${id}`, {}, { withCredentials: true });
            setsave(prev => !prev);
            toast.success(result.data.message);
        }

        catch (err) {
            console.log("SavePost Error :", err.message);
        }
    }

    useEffect(() => {
        if (SelectPost && Userdata?.user?._id) {
            setlike(SelectPost.Likes?.includes(Userdata.user._id));
            setPostlikeCount(SelectPost?.Likes?.length);
            setsave(Userdata?.user?.Saved.includes(id));
        }
    }, [SelectPost, Userdata]);


    const handlePost = async () => {
        try {
            setloading(true);
            const result = await axios.get(`${SERVER_URL}/api/post/selectPost/${id}`, { withCredentials: true });

            if (!result.data?.selectPost) {
                setNotFound(true); // If post is not returned
            }

            dispatch(setSelectPost(result.data?.selectPost));
            setloading(false);
        }

        catch (err) {
            console.log("SelectPost Error :", err.message);
            setloading(false);
            setNotFound(true); // If there's an error fetching the post
        }
    }

    const handleDeletePost = async () => {
        try {
            await axios.post(`${SERVER_URL}/api/post/deletepost/${id}`, {}, { withCredentials: true });
            toast.success("Post Deleted");
            navigate("/profile");
        }

        catch (err) {
            console.log("DeletePost Error :", err.message);
        }
    }

    useEffect(() => {
        handlePost();
    }, [dispatch])

    const handleCopyLink = () => {
        const postUrl = `${window.location.origin}/postDetails/${SelectPost?._id}`;
        toast.success("Copied To Clipboard");
        return navigator.clipboard.writeText(postUrl);
    }

    if (loading) {
        return (
            <div className='flex w-full h-full'>
                <div className='lg:w-[17%]'>
                    <SideBar />
                </div>

                <div className='lg:w-[83%] w-full xl:px-80 lg:px-50 md:px-40 sm:px-30 xs:px-10 px-1 lg:pt-10 pt-18 pb-15 overflow-auto scroll-smooth'>

                    {/* Fake post cards */}
                    <div className=''>
                        {/* Top: Avatar + Username */}
                        <div className='flex gap-4 animate-pulse items-center mb-4'>
                            <div className='w-12 h-12 rounded-full bg-gray-300'></div>
                            <div>
                                <div className='w-32 h-4 bg-gray-300 rounded mb-1'></div>
                                <div className='w-20 h-3 bg-gray-200 rounded'></div>
                            </div>
                        </div>

                        {/* Image block */}
                        <div className='w-full lg:h-115 sm:h-100 h-70 animate-pulse  bg-gray-200 rounded-lg mb-4'></div>

                        {/* Buttons */}
                        <div className='animate-pulse flex items-center justify-between'>
                            <div className='flex gap-4'>
                                <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                                <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                            </div>
                            <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                        </div>

                        <div className='w-24 mt-5 h-3 bg-gray-200 rounded mb-2'></div>

                        {/* Caption and Like */}
                        <div className='mt-4 animate-pulse'>
                            <div className='w-40 h-3 bg-gray-200 rounded mb-2'></div>
                            <div className='w-full mt-1 h-2 bg-gray-100 rounded mb-1'></div>
                            <div className='w-[80%] h-2 bg-gray-100 rounded mb-1'></div>
                            <div className='w-[65%] h-2 bg-gray-100 rounded'></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (notFound) {
        return (
            <div className='flex w-[100vw] h-[100vh]'>
                <div className='lg:w-[17%]'>
                    <SideBar />
                </div>

                <div className='lg:w-[83%] w-full px-1 flex flex-col justify-center items-center text-center'>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/7486/7486800.png"
                        alt="Post not found"
                        className="w-36 h-36 mb-4"
                    />
                    <h2 className='text-2xl font-bold text-gray-800 mb-1'>Post Not Found</h2>
                    <p className='text-gray-500 mb-4 sm:w-75'>The post you're looking for doesn’t exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/explore')}
                        className='bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold'
                    >
                        Go Back to Explore
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className='flex w-[100%] h-[100vh]'>

            <div className='lg:w-[17%]' onClick={() => setToggle(false)}>
                <SideBar />
            </div>

            <div className='lg:w-[83%] xl:px-80 lg:px-50 md:px-40 sm:px-30 xs:px-10 px-1 lg:pb-5 pb-18 lg:pt-10 pt-18 overflow-auto scroll-smooth'>
                <div className='rounded-lg flex flex-col gap-2'>
                    <div className='flex gap-3 items-center justify-between'>
                        <div className='flex gap-3 cursor-pointer' onClick={() => { navigate(`/selectProfile/${SelectPost?.Author?._id}`), setToggle(false), setSendToggle(null) }}>
                            <img src={SelectPost?.Author?.Image} className="h-11 w-11 rounded-full cursor-pointer border-1 border-gray-200" />

                            <div className='flex flex-col justify-center'>
                                <p className="font-semibold text-md flex gap-1 items-center">{SelectPost?.Author?.Username} <span>{SelectPost?.Author?.Username === "Kk's" && <img src="/BlueTik.png" className="h-3 w-3" alt='bluetik' />}</span></p>
                                <p className="text-gray-600 text-[14px] mt-[-4px]">{SelectPost?.Author?.Fullname}</p>
                            </div>
                        </div>

                        <div className='relative'>
                            <p><IoMenu onClick={() => setToggle(prev => !prev)} className='w-7 h-7 cursor-pointer' /></p>

                            <div className={`${!toggle ? "hidden" : ""} sm:w-38 w-34 sm:text-[16px] text-sm p-3 flex flex-col gap-1 rounded-lg bg-gray-100 absolute z-[10] right-0`}>
                                {
                                    Userdata?.user?._id == SelectPost?.Author?._id &&
                                    <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold text-red-600' onClick={handleDeletePost}>Delete</p>
                                }
                                {
                                    Userdata?.user?._id == SelectPost?.Author?._id &&
                                    <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => navigate(`/editpost/${id}`)}>Edit</p>
                                }
                                {
                                    Userdata?.user?._id !== SelectPost?.Author?._id &&
                                    <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => handleFollowUnfollow(SelectPost?.Author?._id)} disabled={followloading} >
                                        {
                                            follow
                                                ? <span className='text-red-500'>UnFollow</span>
                                                : <span className='text-blue-600'>Follow</span>
                                        }
                                    </p>
                                }
                                <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => Userdata?.user?._id === SelectPost?.Author?._id ? navigate("/profile") : navigate(`/selectProfile/${SelectPost?.Author?._id}`)}>View AllPost</p>
                                <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={handleCopyLink}>Copy Link</p>
                                <p className='cursor-pointer p-1 hover:bg-gray-200 px-4 hover:rounded-lg text-center font-semibold border-t-1 border-gray-300' onClick={() => setToggle(false)}>Cancel</p>
                            </div>
                        </div>
                    </div>

                    <div onClick={() => { setToggle(false), setSendToggle(null) }}>
                        <img src={SelectPost?.Image} className='mt-2 border-1 border-gray-300 rounded-lg cursor-pointer w-full h-full max-h-[68vh] min-h-90 shadow-md' onClick={() => window.open(SelectPost?.Image, "_blank")} />
                    </div>

                    <div className='flex justify-between items-center mt-3 px-0.5' onClick={() => { setToggle(false) }}>
                        <div className='flex items-center gap-3'>
                            <p onClick={() => { setToggle(false), setSendToggle(null) }} className='cursor-pointer'>
                                {
                                    like
                                        ? <FaHeart className="h-6.5 w-6.5 cursor-pointer text-red-600" onClick={handleToggleLike} />
                                        : <FaRegHeart className="h-6.5 w-6.5 cursor-pointer" onClick={handleToggleLike} />
                                }
                            </p>
                            <div className='relative'>
                                <p><LuSend className="h-6.5 w-6.5 mb-[-4px] cursor-pointer" onClick={() => setSendToggle(prev => !prev)} /></p>
                                {
                                    sendToggle &&
                                    <div className='absolute lg:bottom-0 lg:left-10 bottom-[30px] left-0 border border-gray-200 bg-white shadow-lg rounded-lg p-3 h-auto lg:w-80 w-fit z-10 flex flex-col gap-2'>
                                        <p className='font-semibold text-gray-600'>Send this post to:</p>
                                        <input type="text" placeholder="Write a message..." className="border rounded px-2 py-1.5 text-[15px] border-gray-300 outline-none" value={sendInput} onChange={(e) => setSendInput(e.target.value)} />

                                        <div className='flex flex-col gap-1 max-h-50 overflow-y-auto'>
                                            {Otheruser?.otherUser?.some(user => followStates[user._id]) ?
                                                Otheruser.otherUser.map(user => {
                                                    const isOnline = OnlineUser?.includes(user._id);
                                                    const isSelected = selectedReceiver[SelectPost._id] === user._id;

                                                    return (
                                                        followStates[user._id] &&
                                                        <div key={user._id} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => setSelectedReceiver(prev => ({ ...prev, [SelectPost._id]: user._id }))}>
                                                            <div className='flex items-center gap-3'>
                                                                <div className='relative'>
                                                                    <img src={user.Image} alt={user.Fullname} className='h-10 w-10 rounded-full border border-gray-200' />
                                                                    {isOnline && (
                                                                        <div className='absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm' />
                                                                    )}
                                                                </div>
                                                                <span className='font-semibold text-sm'>{user.Fullname}</span>
                                                            </div>
                                                        </div>
                                                    )

                                                })
                                                : <div className='flex flex-col items-center justify-center  text-center'>
                                                    <img src="https://img.freepik.com/free-vector/social-media-network-connection_74855-4568.jpg?w=500" alt='No Users' className='w-24 h-24 mb-4 opacity-80' />
                                                    <h2 className='text-lg font-bold text-gray-700'>No users available</h2>
                                                    <p className='text-sm text-gray-500 mt-1'>
                                                        Looks like there’s no one to follow right now. Check back later!
                                                    </p>
                                                </div>

                                            }
                                        </div>

                                        <button className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-1 flex items-center justify-center rounded mt-2 text-sm font-semibold transition-all disabled:opacity-70' disabled={sendLoading} onClick={() => { handleSendPost(selectedReceiver[SelectPost._id], SelectPost.Image) }}>
                                            {
                                                !sendLoading
                                                    ? "Send"
                                                    : <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            }
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>

                        <p onClick={() => { setSendToggle(null), setToggle(false) }}>
                            {
                                save
                                    ? <RiSaveFill className="h-6.5 w-6.5 cursor-pointer" onClick={handleSavePost} />
                                    : <RiSaveLine className="h-6.5 w-6.5 cursor-pointer" onClick={handleSavePost} />
                            }
                        </p>
                    </div>

                    <p onClick={() => { setToggle(false), setSendToggle(null) }} className='font-semibold mt-1 px-0.5'>{postLikeCount} Likes</p>

                    <p onClick={() => setSendToggle(null)} className='text-gray-500 text-[13px] px-0.5'>{new Date(SelectPost?.createdAt).toLocaleDateString("en-US",
                        {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}
                    </p>

                    <div className='flex gap-1 px-0.5' onClick={() => { setToggle(false), setSendToggle(null) }}>
                        <span className='font-bold'>{SelectPost?.Author?.Username}</span>
                        <p className='font-semibold'>-</p>
                        <p className={`cursor-pointer whitespace-pre-wrap ${select ? "" : "line-clamp-2"}`} onClick={() => setselect(prev => !prev)}>{SelectPost?.Caption}</p>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default ShowSelectPost
