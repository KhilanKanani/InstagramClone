import { useSelector } from "react-redux"
import SideBar from "../OtherComponent/SideBar"
import { RiSaveFill } from "react-icons/ri";
import { useState } from "react";
import { useNavigate } from "react-router";
import millify from "millify";
import { RiSaveLine } from "react-icons/ri";
import FindUserPost from "../FindCurrentData/FindUserPost";
import FindUserSavePost from "../FindCurrentData/FindUserSavePost";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { BsGrid3X3Gap } from "react-icons/bs";

const Profile = () => {

    FindUserPost();
    FindUserSavePost();

    const { Userdata } = useSelector(state => state.User);
    const { Userpost, SavePost } = useSelector(state => state.Post);
    const navigate = useNavigate();

    const location = useLocation();
    const selectedTabFromNav = location.state?.selectedTab;
    const [select, setselect] = useState(selectedTabFromNav || "Posts");

    useEffect(() => {
        if (selectedTabFromNav) {
            setselect(selectedTabFromNav);
        }
    }, [selectedTabFromNav]);

    const isLoadingPosts = !Userpost?.Post;

    return (
        <div className='flex w-[100%] h-[100%]'>

            <div className='lg:w-[17%]'>
                <SideBar />
            </div>

            <div className='lg:w-[83%] w-[100vw] lg:px-30 px-1 lg:pt-10 pt-18 pb-10 overflow-auto scroll-smooth'>
                <div className="w-full flex sm:gap-20 xs:gap-7 gap-3">
                    <img src={Userdata?.user?.Image || "ChatlyDp.png"} className="lg:h-40 h-30 lg:w-40 w-30 rounded-full cursor-pointer border-1 border-gray-200" onClick={() => window.open(Userdata?.user?.Image, "_blank")} />

                    <div className="flex flex-col lg:gap-5 gap-3">
                        <div className="flex lg:flex-row flex-col items-start justify-start sm:gap-5 gap-1">
                            <p className="font-bold text-xl flex items-center justify-center gap-1">{Userdata?.user?.Username} <span>{Userdata?.user?.Username === "Kk's" && <img src="BlueTik.png" className="h-3 w-3" />}</span></p>
                            <div className="flex gap-1">
                                <button className="bg-gray-200 hover:bg-gray-300 cursor-pointer sm:px-4 px-2 py-1 rounded-md font-semibold outline-0" onClick={() => navigate("/editprofile")}>Edit Profile</button>
                                <button className="bg-gray-200 lg:hidden block hover:bg-gray-300 cursor-pointer sm:px-4 px-2 py-1 rounded-md font-semibold outline-0" onClick={() => navigate("/logout")}>Logout</button>
                            </div>
                        </div>

                        <div className=" flex lg:gap-10 xs:gap-5 gap-2">
                            <p className="font-bold text-xl flex lg:flex-row flex-col items-center justify-center lg:gap-1">{Userpost?.Post?.length && millify(Userpost?.Post?.length) || "0"} <span className="text-gray-400 text-[13px] sm:text-[14px] font-semibold lg:mt-1">Post</span></p>
                            <p onClick={() => { localStorage.setItem("select", "Followers"); navigate(`/profiledata/${Userdata?.user?._id}`) }} className=" flex lg:flex-row flex-col items-center justify-center lg:gap-1 font-bold text-xl cursor-pointer">{millify(93054838384858 ||Userdata?.user?.Followers.length)} <span className="text-gray-400  text-[13px] sm:text-[14px] font-semibold  lg:mt-1">Followers</span></p>
                            <p onClick={() => { localStorage.setItem("select", "Following"); navigate(`/profiledata/${Userdata?.user?._id}`) }} className=" flex lg:flex-row flex-col items-center justify-center lg:gap-1 font-bold text-xl cursor-pointer">{millify(Userdata?.user?.Following.length) || "0"} <span className="text-gray-400  text-[13px] sm:text-[14px] font-semibold  lg:mt-1">Following</span></p>
                        </div>

                        <div className="lg:block hidden">
                            <p className="font-bold">{Userdata?.user?.Fullname ? Userdata?.user?.Fullname : "User"}</p>
                            <textarea className="outline-0 resize-none overflow-auto text-sm cursor-pointer sm:w-70" value={Userdata?.user?.Bio} rows={5} readOnly />
                        </div>
                    </div>
                </div>

                <div className="lg:hidden mt-4 flex flex-col">
                    <p className="font-bold">{Userdata?.user?.Fullname ? Userdata?.user?.Fullname : "User"}</p>
                    <textarea className="outline-0 resize-none overflow-auto text-sm cursor-pointer sm:w-70" value={Userdata?.user?.Bio} rows={5} readOnly />
                </div>

                <div className="mt-7 border-gray-300 border-t-1 flex sm:gap-20 gap-10 justify-center">
                    <p className={`flex gap-1 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Posts" ? "border-t-1 font-semibold opacity-100 mt-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Posts") }}><span className="text-sm sm:text-md">{select == "Posts" ? <BsFillGrid3X3GapFill className="h-4.5 w-4.5" /> : <BsGrid3X3Gap className="h-4.5 w-4.5" />}</span> Posts</p>
                    <p className={`flex gap-1 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Saved" ? "border-t-1 font-semibold opacity-100 mt-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Saved") }}><span className="text-sm sm:text-md">{select == "Saved" ? <RiSaveFill className="h-5 w-5" /> : <RiSaveLine className="h-5 w-5" />}</span> Saved</p>
                </div>

                {
                    select == "Posts" &&
                    <div className="mt-5 grid grid-cols-3 lg:pb-0 pb-8 gap-1">
                        {
                            isLoadingPosts
                                ? [...Array(9)].map((_, index) => (
                                    <div key={index} className="bg-gray-300 animate-pulse w-full xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30" />
                                ))

                                : Userpost?.Post?.length > 0
                                    ? Userpost?.Post?.map((item, index) => (
                                        <div key={index}>
                                            <img src={item?.Image} className="border-1 border-gray-200 xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30 w-full cursor-pointer" onClick={() => navigate(`/postDetails/${item?._id}`)} />
                                        </div>
                                    ))
                                    : <div className="flex flex-col w-[100vw] lg:w-[100%] lg:ml-87.5 gap-2 lg:mt-30 mt-10 justify-center items-center">
                                        <p className="font-bold text-2xl">Create your first post </p>
                                        <p className="text-sm font-semibold">Share your first point of view</p>
                                        <p className="mt-2 cursor-pointer font-semibold bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 w-fit rounded-full" onClick={() => navigate("/createpost")}>Create Post</p>
                                    </div>
                        }
                    </div>
                }

                {
                    select == "Saved" &&
                    <div className="mt-5 grid grid-cols-3 lg:pb-0 pb-8 gap-1">
                        {
                            isLoadingPosts
                                ? [...Array(9)].map((_, index) => (
                                    <div key={index} className="bg-gray-300 animate-pulse w-full xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30" />
                                ))

                                : SavePost?.Saved?.length > 0
                                    ? SavePost?.Saved?.map((item, index) => (
                                        // Userdata?.user?.Following?.includes(item?.Author?._id) &&
                                        <div key={index}>
                                            <img src={item?.Image} className="border-1 border-gray-200 xl:h-100 lg:h-80 md:h-70 sm:h-60 xs:h-50 h-30 w-full cursor-pointer" onClick={() => navigate(`/postDetails/${item?._id}`)} />
                                        </div>
                                    ))
                                    : <div className="flex flex-col lg:mt-30 w-[100vw] mt-10 lg:w-[105%] lg:ml-87 items-center justify-enter">
                                        <h2 className="text-2xl px-2 lg:px-0 text-center font-bold text-gray-800 mb-2">
                                            You haven’t saved anything yet
                                        </h2>

                                        <p className="text-gray-500 text-sm font-semibold mb-4 lg:max-w-md">
                                            Your saved posts will show up here.
                                        </p>

                                        <button
                                            onClick={() => navigate('/explore')}
                                            className="bg-pink-600 cursor-pointer text-white font-semibold px-6 py-2 rounded-full hover:bg-pink-700 transition shadow-md"
                                        >
                                            Explore Popular Posts
                                        </button>
                                    </div>
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default Profile
