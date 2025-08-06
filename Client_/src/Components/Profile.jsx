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

            <div className='w-[17%]'>
                <SideBar />
            </div>

            <div className='w-[83%] px-30 pt-10 pb-5 overflow-auto scroll-smooth'>
                <div className=" w-full h-[230px] flex gap-20">
                    <div>
                        <img src={Userdata?.user?.Image || "ChatlyDp.png"} className="h-40 w-40 rounded-full cursor-pointer border-1 border-gray-200" onClick={() => window.open(Userdata?.user?.Image, "_blank")} />
                    </div>

                    <div>
                        <div className="flex gap-5">
                            <p className="font-semibold text-2xl">{Userdata?.user?.Username}</p>
                            <button className="bg-gray-200 hover:bg-gray-300 cursor-pointer px-4 rounded-md font-semibold outline-0" onClick={() => navigate("/editprofile")}>Edit Profile</button>
                        </div>

                        <div className="mt-7 flex gap-10">
                            <p className="font-bold text-xl">{Userpost?.Post?.length && millify(Userpost?.Post?.length) || "0"} <span className="text-gray-400 text-[14px] font-semibold">Post</span></p>
                            <p onClick={() => { localStorage.setItem("select", "Followers"); navigate(`/profiledata/${Userdata?.user?._id}`) }} className="font-bold text-xl cursor-pointer">{millify(Userdata?.user?.Followers.length)} <span className="text-gray-400 text-[14px] font-semibold ">Followers</span></p>
                            <p onClick={() => { localStorage.setItem("select", "Following"); navigate(`/profiledata/${Userdata?.user?._id}`) }} className="font-bold text-xl cursor-pointer">{millify(Userdata?.user?.Following.length)} <span className="text-gray-400 text-[14px] font-semibold ">Following</span></p>
                        </div>

                        <div className="mt-5">
                            <p className="font-bold">{Userdata?.user?.Fullname ? Userdata?.user?.Fullname : "User"}</p>
                            <textarea className="outline-0 resize-none overflow-auto text-sm cursor-pointer" value={Userdata?.user?.Bio} cols={50} rows={5} readOnly />
                        </div>
                    </div>
                </div>

                <div className="mt-7 border-gray-300 border-t-1 flex gap-20 justify-center">
                    <p className={`flex gap-1 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Posts" ? "border-t-1 font-semibold opacity-100 mt-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Posts") }}><span>{select == "Posts" ? <BsFillGrid3X3GapFill className="h-4.5 w-4.5" /> : <BsGrid3X3Gap className="h-4.5 w-4.5" />}</span> Posts</p>
                    <p className={`flex gap-1 justify-center items-center pt-3 opacity-50 cursor-pointer ${select == "Saved" ? "border-t-1 font-semibold opacity-100 mt-[-0.5px] border-black" : "border-t-0"}`} onClick={() => { setselect("Saved") }}><span>{select == "Saved" ? <RiSaveFill className="h-5 w-5" /> : <RiSaveLine className="h-5 w-5" />}</span> Saved</p>
                </div>

                {
                    select == "Posts" &&
                    <div className="mt-5 grid grid-cols-3 gap-1">
                        {
                            isLoadingPosts
                                ? [...Array(9)].map((_, index) => (
                                    <div key={index} className="bg-gray-300 animate-pulse w-full xl:h-100 lg:h-70 md:h-50 sm:h-30 h-20 rounded" />
                                ))

                                : Userpost?.Post?.length > 0
                                    ? Userpost?.Post?.map((item, index) => (
                                        <div key={index}>
                                            <img src={item?.Image} className="border-1 border-gray-200 xl:h-100 lg:h-70 md:h-50 sm:h-30 h-20 w-full cursor-pointer" onClick={() => navigate(`/postDetails/${item?._id}`)} />
                                        </div>
                                    ))
                                    : <div className="flex flex-col w-[100%] ml-87.5 gap-2 mt-30 justify-center items-center">
                                        <p className="font-bold text-2xl">Create your first post </p>
                                        <p className="text-sm font-semibold">Share your first point of view</p>
                                        <p className="mt-2 cursor-pointer font-semibold bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 w-fit rounded-full" onClick={() => navigate("/createpost")}>Create Post</p>
                                    </div>
                        }
                    </div>
                }

                {
                    select == "Saved" &&
                    <div className="mt-5 grid grid-cols-3 gap-1">
                        {
                            SavePost?.Saved?.length > 0
                                ? SavePost?.Saved?.map((item, index) => (
                                    // Userdata?.user?.Following?.includes(item?.Author?._id) &&
                                    <div key={index}>
                                        <img src={item?.Image} className="border-1 border-gray-200 xl:h-100 lg:h-70 md:h-50 sm:h-30 h-20 w-full cursor-pointer" onClick={() => navigate(`/postDetails/${item?._id}`)} />
                                    </div>
                                ))
                                : <div className="flex flex-col mt-30 w-[105%] ml-87 items-center justify-enter">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        You haven’t saved anything yet
                                    </h2>

                                    <p className="text-gray-500 text-sm font-semibold mb-4 max-w-md">
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

                {
                    SavePost?.Saved?.length > 0 && <p className=' mt-5 font-semibold text-gray-300 text-center'>&copy;2025 - Present Kk's Pvt Ltd...</p>
                }
            </div>
        </div>
    )
}

export default Profile
