import SideBar from "./SideBar"
import { IoMdGrid } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux'
import millify from "millify";
import axios from "axios";
import { SERVER_URL } from "../main";
import { setSelectProfile } from "../Redux/UserSlice";
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

            <div className='lg:w-[17%]'>
                <SideBar />
            </div>

            {
                isLoading
                    ? <div className='lg:w-[83%] p-1 w-full lg:px-30 lg:mt-10 mt-18'>
                        {/* Profile Header Loading */}
                        <div className="w-full h-[230px] flex lg:gap-20 gap-3">
                            <div>
                                <div className="lg:h-40 lg:w-40 w-30 h-30 rounded-full bg-gray-300"></div>
                            </div>

                            <div className='mt-2 flex flex-col gap-4'>
                                <div className="flex gap-3">
                                    <div className="lg:w-48 w-30 h-6 bg-gray-300 rounded"></div>
                                    <div className="lg:w-20 w-0 h-6 bg-gray-300 rounded"></div>
                                    <div className="lg:w-24 w-0 h-6 bg-gray-300 rounded"></div>
                                </div>

                                <div className="flex lg:gap-10 gap-2 mt-5">
                                    <div className="lg:w-24 w-10 h-5 bg-gray-300 rounded"></div>
                                    <div className="lg:w-24 w-10 h-5 bg-gray-300 rounded"></div>
                                    <div className="lg:w-24 w-10 h-5 bg-gray-300 rounded"></div>
                                </div>

                                <div className='mt-5 space-y-2'>
                                    <div className='lg:w-40 w-10 h-4 bg-gray-300 rounded'></div>
                                    <div className='lg:w-[400px] w-20 h-4 bg-gray-300 rounded'></div>
                                    <div className='lg:w-[300px] w-30 h-4 bg-gray-300 rounded'></div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-5 border-gray-300 border-t-1 flex gap-20 justify-center">
                            <div className="h-6 w-24 bg-gray-300 rounded mt-3"></div>
                        </div>

                        {/* Grid of Posts Loading */}
                        <div className="mt-5 grid grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="cursor-pointer border-1  bg-gray-300 border-gray-200 xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30  w-full" />
                            ))}
                        </div>
                    </div>

                    : <div className='lg:w-[83%] mt-18 w-full p-1 lg:px-30 lg:mt-10 overflow-auto scroll-smooth'>
                        <div className="w-full lg:h-[230px] flex lg:gap-20 xs:gap-7 gap-3">
                            <div>
                                <img src={selectProfile?.user?.Image} className="lg:h-40 lg:w-40 h-30 w-30 rounded-full cursor-pointer border-1 border-gray-200" onClick={() => window.open(selectProfile?.user?.Image, "_blank")} />
                            </div>

                            <div className='flex flex-col lg:gap-5 gap-3'>
                                <div className="flex lg:flex-row flex-col gap-1 sm:gap-3">
                                    <p className="font-bold text-xl flex items-center gap-1">{selectProfile?.user?.Username}
                                        <span>{selectProfile?.user?.Username == "Kk's" && <img src="/BlueTik.png" className="h-3 w-3" alt="bluetik"/>}</span>
                                    </p>
                                    
                                    <div className="flex gap-1">
                                        <button onClick={handleFollowUnfollow} disabled={loading} className="cursor-pointer ">
                                            {
                                                !follow
                                                    ? <p className="bg-blue-500  hover:bg-blue-600 text-white cursor-ointer py-1 lg:px-4 px-2 rounded-md font-semibold outline-0 cursor-pointer">Follow</p>
                                                    : <p className="bg-gray-200 text-black hover:bg-gray-300 cursor-ointer py-1 lg:px-4 px-2 rounded-md font-semibold outline-0 cursor-pointer">Following</p>
                                            }
                                        </button>
                                        {/* <button className="bg-gray-200 hover:bg-gray-300 cursor-pointer px-4 rounded-md font-semibold outline-0" onClick={() => { localStorage.setItem("selectedUser", JSON.stringify(selectProfile?.user)); follow && navigate(`/message`) }}>Message</button> */}
                                        <button className="bg-gray-200  hover:bg-gray-300 cursor-pointer lg:px-4 px-2 py-1 rounded-md font-semibold outline-0" onClick={() => { localStorage.setItem("selectedUser", JSON.stringify(selectProfile?.user)); navigate(`/message`) }}>Message</button>
                                    </div>
                                </div>

                                <div className=" flex lg:gap-10 xs:gap-5 gap-2">
                                    <p className="font-bold text-xl flex lg:flex-row flex-col items-center justify-center lg:gap-1">{SelectUserPost?.Post?.length && millify(SelectUserPost?.Post?.length) || 0} <span className="text-gray-400 text-[14px] font-semibold">Post</span></p>
                                    <p onClick={() => { localStorage.setItem("select", "Followers"); follow && navigate(`/profiledata/${selectProfile?.user?._id}`) }} className="font-bold flex  text-xl cursor-pointer lg:flex-row flex-col items-center justify-center lg:gap-1">{selectProfile?.user?.Followers?.length > 0 ? followCount : 0} <span className="text-gray-400 text-[14px] sm:text-[14px]  lg:mt-1 font-semibold ">Followers</span></p>
                                    <p onClick={() => { localStorage.setItem("select", "Following"); follow && navigate(`/profiledata/${selectProfile?.user?._id}`) }} className="font-bold flex text-xl cursor-pointer lg:flex-row flex-col items-center justify-center lg:gap-1">{selectProfile?.user?.Following?.length > 0 ? millify(selectProfile?.user?.Following.length) : 0} <span className="text-gray-400 text-[14px] sm:text-[14px] font-semibold  lg:mt-1 ">Following</span></p>
                                </div>

                                <div className="mt-5 overflow-scroll lg:inline-block hidden">
                                    <p className="font-bold">{selectProfile?.user?.Fullname}</p>
                                    <textarea className="outline-0 resize-none overflow-auto w-70 text-sm" value={selectProfile?.user?.Bio} rows={5} readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 overflow-scroll inline-block lg:hidden">
                            <p className="font-bold">{selectProfile?.user?.Fullname}</p>
                            <textarea className="outline-0 resize-none overflow-auto w-70 text-sm" value={selectProfile?.user?.Bio} rows={5} readOnly />
                        </div>

                        <div className="mt-7 border-gray-300 border-t-1 flex gap-20 justify-center">
                            <p className={`flex gap-1 justify-center items-center pt-3 cursor-pointer border-t-1 font-semibold  mt-[-0.5px] border-black" : "border-t-0`}><span><IoMdGrid className="h-5 w-5" /></span> Posts</p>
                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-1 mb-10 lg:mb-0">
                            {
                                follow
                                    ? SelectUserPost?.Post?.length > 0
                                        ? SelectUserPost?.Post?.map((item, index) => (
                                            <div key={index}>
                                                <img
                                                    src={item?.Image}
                                                    className="cursor-pointer border-1 border-gray-200 xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30  w-full"
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
                                                onClick={() => navigate('/suggestedUser')}
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
                    </div>
            }
        </div>
    )
}

export default ShowSelectProfile
