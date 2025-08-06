import SideBar from "./SideBar"
import { IoMdGrid } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux'
import millify from "millify";
import axios from "axios";
import { SERVER_URL } from "../main";
import { setSelectProfile, setUserdata } from "../Redux/UserSlice";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";
import { setSelectUserPost } from "../Redux/PostSlice";
import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";

const ShowSelectProfile = () => {

    const { selectProfile, Userdata } = useSelector(state => state.User);
    const { SelectUserPost } = useSelector(state => state.Post);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [follow, setfollow] = useState(false);
    const [followCount, setfollowCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleFollowUnfollow = async () => {
        try {
            setLoading(true);
            await axios.post(`${SERVER_URL}/api/user/followOrUnfollow/${id}`, {}, { withCredentials: true });

            if (!follow) {
                setfollow(true);
                setfollowCount(count => count + 1);
            }
            else {
                setfollow(false);
                setfollowCount(count => count - 1);
            }
            setLoading(false);
        }

        catch (err) {
            setLoading(false);
            console.log("FollowUnfollow Error :", err.message);
        }
    }

    useEffect(() => {
        setfollow(selectProfile?.user?.Followers?.includes(Userdata?.user?._id));
        setfollowCount(selectProfile?.user?.Followers?.length);
    }, [selectProfile, Userdata]);

    const handleSelectProfile = async () => {
        try {
            const result = await axios.get(`${SERVER_URL}/api/user/getProfile/${id}`, { withCredentials: true });
            dispatch(setSelectProfile(result.data));
        }

        catch (err) {
            console.log("SelectProfile Error :", err.message);
        }
    }

    const handleSelectUserPost = async () => {
        try {
            const result = await axios.get(`${SERVER_URL}/api/post/otheruserpost/${id}`, { withCredentials: true });
            dispatch(setSelectUserPost(result.data));
        }

        catch (err) {
            console.log("SelectUserPost Error :", err.message);
        }
    }

    useEffect(() => {
        handleSelectProfile();
        handleSelectUserPost();
    }, [dispatch]);

    const isLoading = !selectProfile?.user || !SelectUserPost?.Post;

    return (
        <div className='flex w-[100%] h-[100vh]'>

            <div className='w-[17%]'>
                <SideBar />
            </div>

            {
                isLoading
                    ? <div className='w-[83%] px-30 mt-10'>
                        {/* Profile Header Loading */}
                        <div className="w-full h-[230px] flex gap-20">
                            <div>
                                <div className="h-40 w-40 rounded-full bg-gray-300"></div>
                            </div>

                            <div className='flex flex-col gap-4'>
                                <div className="flex gap-3">
                                    <div className="w-48 h-6 bg-gray-300 rounded"></div>
                                    <div className="w-20 h-6 bg-gray-300 rounded"></div>
                                    <div className="w-24 h-6 bg-gray-300 rounded"></div>
                                </div>

                                <div className="flex gap-10 mt-5">
                                    <div className="w-24 h-5 bg-gray-300 rounded"></div>
                                    <div className="w-24 h-5 bg-gray-300 rounded"></div>
                                    <div className="w-24 h-5 bg-gray-300 rounded"></div>
                                </div>

                                <div className='mt-5 space-y-2'>
                                    <div className='w-40 h-4 bg-gray-300 rounded'></div>
                                    <div className='w-[400px] h-4 bg-gray-300 rounded'></div>
                                    <div className='w-[300px] h-4 bg-gray-300 rounded'></div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-7 border-gray-300 border-t-1 flex gap-20 justify-center">
                            <div className="h-6 w-24 bg-gray-300 rounded mt-3"></div>
                        </div>

                        {/* Grid of Posts Loading */}
                        <div className="mt-5 grid grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="cursor-pointer border-1  bg-gray-300 border-gray-200 xl:h-100 lg:h-70 md:h-50 sm:h-30 h-20 w-full" />
                            ))}
                        </div>
                    </div>

                    : <div className='w-[83%] px-30 mt-10'>
                        <div className="w-full h-[230px] flex gap-20">
                            <div>
                                <img src={selectProfile?.user?.Image} className="h-40 w-40 rounded-full cursor-pointer border-1 border-gray-200" onClick={() => window.open(selectProfile?.user?.Image, "_blank")} />
                            </div>

                            <div>
                                <div className="flex gap-2">
                                    <p className="font-semibold text-2xl pr-3">{selectProfile?.user?.Username}</p>
                                    <button onClick={handleFollowUnfollow} disabled={loading} className="cursor-pointer">
                                        {
                                            !follow
                                                ? <p className="bg-blue-500  hover:bg-blue-600 text-white cursor-ointer py-1 px-4 rounded-md font-semibold outline-0 cursor-pointer">Follow</p>
                                                : <p className="bg-gray-200 text-black hover:bg-gray-300 cursor-ointer py-1 px-4 rounded-md font-semibold outline-0 cursor-pointer">Following</p>
                                        }
                                    </button>
                                    {/* <button className="bg-gray-200 hover:bg-gray-300 cursor-pointer px-4 rounded-md font-semibold outline-0" onClick={() => { localStorage.setItem("selectedUser", JSON.stringify(selectProfile?.user)); follow && navigate(`/message`) }}>Message</button> */}
                                    <button className="bg-gray-200 hover:bg-gray-300 cursor-pointer px-4 rounded-md font-semibold outline-0" onClick={() => { localStorage.setItem("selectedUser", JSON.stringify(selectProfile?.user)); navigate(`/message`) }}>Message</button>
                                </div>

                                <div className="mt-7 flex gap-10">
                                    <p className="font-bold text-xl">{SelectUserPost?.Post?.length && millify(SelectUserPost?.Post?.length) || 0} <span className="text-gray-400 text-[14px] font-semibold">Post</span></p>
                                    <p onClick={() => { localStorage.setItem("select", "Followers"); follow && navigate(`/profiledata/${selectProfile?.user?._id}`) }} className="font-bold text-xl cursor-pointer">{selectProfile?.user?.Followers?.length > 0 ? followCount : 0} <span className="text-gray-400 text-[14px] font-semibold ">Followers</span></p>
                                    <p onClick={() => { localStorage.setItem("select", "Following"); follow && navigate(`/profiledata/${selectProfile?.user?._id}`) }} className="font-bold text-xl cursor-pointer">{selectProfile?.user?.Following?.length > 0 ? millify(selectProfile?.user?.Following.length) : 0} <span className="text-gray-400 text-[14px] font-semibold ">Following</span></p>
                                </div>

                                <div className="mt-5">
                                    <p className="font-bold">{selectProfile?.user?.Fullname}</p>
                                    <textarea className="outline-0 resize-none overflow-auto text-sm" value={selectProfile?.user?.Bio} cols={50} rows={5} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="mt-7 border-gray-300 border-t-1 flex gap-20 justify-center">
                            <p className={`flex gap-1 justify-center items-center pt-3 cursor-pointer border-t-1 font-semibold  mt-[-0.5px] border-black" : "border-t-0`}><span><IoMdGrid className="h-5 w-5" /></span> Posts</p>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-1">
                            {
                                follow
                                    ? SelectUserPost?.Post?.length > 0
                                        ? SelectUserPost?.Post?.map((item, index) => (
                                            <div key={index}>
                                                <img
                                                    src={item?.Image}
                                                    className="cursor-pointer border-1 border-gray-200 xl:h-100 lg:h-70 md:h-50 sm:h-30 h-20 w-full"
                                                    onClick={() => navigate(`/postDetails/${item?._id}`)}
                                                />
                                            </div>))
                                        : <div className="col-span-3 flex flex-col items-center justify-center h-96 p-6">
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/4149/4149643.png"
                                                alt="No Posts"
                                                className="w-32 h-32 mb-4 opacity-90"
                                            />
                                            <h2 className="text-2xl font-bold text-gray-800">No Posts Yet</h2>
                                            <p className="text-gray-500 text-base text-center mt-2 max-w-md">
                                                This user hasn't shared anything yet. Once they do, their posts will show up here.
                                            </p>
                                            <button
                                                onClick={() => navigate('/explore')}
                                                className="mt-5 px-6 py-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white  rounded-lg shadow-lg transition duration-300"
                                            >
                                                Discover Other Creators
                                            </button>
                                        </div>


                                    : <div className="col-span-3 flex flex-col items-center py-10">
                                        <IoLockClosedOutline className="bg-gray-200 p-3 h-16 w-16 rounded-full text-gray-600" />
                                        <p className='text-center text-gray-500 font-semibold mt-2'>Follow to see posts</p>
                                    </div>

                            }
                        </div>

                        {
                            follow && SelectUserPost?.Post?.length > 0 && <p className='py-5 font-semibold text-gray-300 text-center'>&copy;2025 - Present Kk's Pvt Ltd...</p>
                        }
                    </div>
            }
        </div>
    )
}

export default ShowSelectProfile
