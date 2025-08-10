import { IoHome, IoNotifications } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { BsFillCameraReelsFill, BsSun } from "react-icons/bs";
import { IoMdMenu } from "react-icons/io";
import { FaSquarePlus } from "react-icons/fa6";
import InstaLogo from "/InstaLogo.jpeg";
import { useState } from "react";
import { useNavigate } from "react-router";
import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useLocation } from "react-router";
import { BsCameraReels } from "react-icons/bs";
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdExplore } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { IoSearchCircle } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiMessengerFill, RiMessengerLine } from "react-icons/ri";

const SideBar = ({ loading, loadingSave, id, Fullname }) => {

    const [toggle, settoggle] = useState(false);
    const navigate = useNavigate();
    const { Userdata } = useSelector(state => state.User);
    const { Notification } = useSelector(state => state.Socket);

    const location = useLocation();
    const currentPath = location.pathname;

    const sideMenu = [
        { icon: currentPath == "/" ? <IoHome className="h-6.5 w-6.5" /> : <IoHomeOutline className="h-6.5 w-6.5" />, text: "Home", route: "/" },
        { icon: currentPath == "/search" ? <IoSearchCircle className="h-6.5 w-6.5" /> : <IoSearch className="h-6.5 w-6.5" />, text: "Search", route: "/search" },
        { icon: currentPath == "/message" ? <RiMessengerFill className="h-6.5 w-6.5" /> : <RiMessengerLine className="h-6.5 w-6.5" />, text: "Message", route: '/message' },
        { icon: currentPath == "/notification" ? <FaHeart className="h-6.5 w-6.5" /> : <FaRegHeart className="h-6.5 w-6.5" />, text: "Notification", route: "/notification" },
        { icon: currentPath == "/explore" ? < MdExplore className="h-6.5 w-6.5" /> : <MdOutlineExplore className="h-6.5 w-6.5" />, text: "Explore", route: "/explore" },
        { icon: currentPath == "/createpost" ? <FaSquarePlus className="h-6.5 w-6.5" /> : <FaRegSquarePlus className="h-6.5 w-6.5" />, text: "Post", route: "/createpost" },
        // { icon: currentPath == "/reels" ? <BsFillCameraReelsFill className="h-6.5 w-6.5" /> : <BsCameraReels className="h-6.5 w-6.5" />, text: "Reels", route: "/reels" },
        { icon: currentPath == "/profile" ? <img src={Userdata?.user?.Image} className="h-6.5 border-1 border-gray-200 w-6.5 rounded-full" /> : <CgProfile className="h-6.5 w-6.5" />, text: "Profile", route: "/profile" },
    ]

    function handleNavigate(routes) {
        if (Userdata?.user?.Fullname !== "") {
            navigate(routes);
        }
        else if (Fullname !== "") {
            toast.error("Please Save Them Before Leaving!");
            navigate("/editprofile");
        }
        else {
            toast.error("Fullname Is Required");
            navigate("/editprofile");
        }

        if (loading) {
            toast.error("Waiting To Upload Post");
            navigate("/createpost");
        }

        if (loadingSave) {
            toast.error("Waiting To Edit Post");
            navigate(`/editpost/${id}`);
        }

        settoggle(false);
    }

    function handleNavigateProfile(item) {
        if (Userdata?.user?.Fullname) {
            navigate("/profile", { state: { selectedTab: item } });
            // setselectProfile(item)
        }
        else if (Fullname !== "") {
            toast.error("Please Save The Changes");
            navigate("/editprofile");
        }
        else {
            toast.error("Fullname Is Required");
            navigate("/editprofile");
        }

        settoggle(false);
    }


    return (
        <div>
            {/* DeskTop Size */}
            <div className="lg:flex hidden w-[17%] h-full fixed top-0 left-0 bottom-0 py-4 flex-col bg-white border-r border-gray-300 shadow-sm z-50">

                {/* :: Logo :: */}
                <img
                    src={InstaLogo}
                    alt="InstaLogo"
                    className="px-6 w-40 h-12 mix-blend-multiply mt-2 mb-4"
                />

                {/* :: Sidebar Menu Items :: */}
                <div className="flex flex-col gap-3 px-3 mt-2">
                    {sideMenu?.map((item, index) => (
                        <div
                            key={index}
                            className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 ${currentPath === item?.route ? "bg-gray-100 font-bold" : "font-normal"
                                }`}
                            onClick={() => {
                                handleNavigate(item?.route);
                                settoggle(false);
                            }}
                        >
                            <div className="relative">
                                <span>{item.icon}</span>

                                {item.text === "Notification" && Notification?.length > 0 && (
                                    <p className="absolute top-[-6px] left-[-10px] text-[11px] text-white w-5 h-5 flex items-center justify-center font-bold bg-red-500 rounded-full shadow-md">
                                        {Notification.length}
                                    </p>
                                )}
                            </div>
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>

                {/* :: Bottom Menu Button :: */}
                <div className="flex flex-col gap-2 fixed bottom-4 w-[15.3%] px-3">
                    <div
                        className="flex items-center gap-4 cursor-pointer px-4 py-3 rounded-lg transition-all hover:bg-gray-100"
                        onClick={() => settoggle((prev) => !prev)}
                    >
                        <span>
                            {!toggle ? <IoMdMenu className="h-6 w-6" /> : <RxCross2 className="h-6 w-6" />}
                        </span>
                        <span>Menu</span>
                    </div>
                </div>

                {/* :: Toggle Menu Dropdown :: */}
                <div
                    className={`fixed bottom-20 w-[13.5%] mx-3 px-4 py-3 rounded-lg bg-gray-100 shadow-md transition-all duration-300 ${toggle ? "flex flex-col gap-1" : "hidden"
                        }`}
                >
                    <p
                        onClick={() => handleNavigateProfile("Posts")}
                        className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-semibold"
                    >
                        Post
                    </p>
                    <p
                        onClick={() => handleNavigateProfile("Saved")}
                        className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-semibold"
                    >
                        Saved Post
                    </p>
                    <p
                        onClick={() => navigate("/logout")}
                        className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-semibold border-t border-gray-300"
                    >
                        Logout
                    </p>
                </div>
            </div>

            {/*  Mobile Size */}
            <div>
                <div className={`flex fixed top-0 left-0 right-0 h-[60px] bg-gray-50 border-b border-gray-200 z-50 items-center justify-between sm:px-5 px-1 lg:hidden`}>
                    <img src={InstaLogo} alt="InstaLogo" className="h-10 w-auto mix-blend-multiply" />
                    <div className="flex gap-4 text-2xl text-gray-700">
                        <div className="cursor-pointer relative" onClick={() => { currentPath === "/notification"; handleNavigate("/notification") }}>
                            {currentPath == "/notification" ? <FaHeart className="h-6 w-6" /> : <FaRegHeart className="h-6 w-6" />}
                            {Notification?.length > 0 && (
                                <p className="absolute top-[-6px] left-[-5px] text-[11px] text-white w-4 h-4 flex items-center justify-center font-bold bg-red-500 rounded-full shadow-md">
                                    {Notification.length}
                                </p>
                            )}                     </div>
                        <div className="cursor-pointer" onClick={() => handleNavigate("/message")}>
                            {currentPath == "/message" ? <RiMessengerFill className="h-6.5 w-6.5" /> : <RiMessengerLine className="h-6.5 w-6.5" />}
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 h-[60px] border-gray-200 bg-gray-50 border-t z-50 flex justify-between sm:px-5 px-3 items-center text-gray-700 lg:hidden">
                    <div className="flex flex-col gap-1 justify-center items-center cursor-pointer" onClick={() => { currentPath === "/"; handleNavigate("/") }}>
                        {currentPath === "/" ? <IoHome className="text-2xl" /> : <IoHomeOutline className="text-2xl" />}
                        <span className={`text-[10px] ${currentPath === "/" ? "font-bold" : "font-normal"}`}>Home</span>
                    </div>
                    <div className="flex gap-1 flex-col items-center cursor-pointer" onClick={() => { currentPath === "/search"; handleNavigate("/search") }}>
                        {currentPath === "/search" ? <IoSearchCircle className="text-2xl" /> : <IoSearch className="text-2xl" />}
                        <span className={`text-[10px] ${currentPath === "/search" ? "font-bold" : "font-normal"}`}>Search</span>
                    </div>
                    <div className="flex gap-1 flex-col items-center cursor-pointer" onClick={() => { currentPath === "/createpost"; handleNavigate("/createpost") }}>
                        {currentPath == "/createpost" ? <FaSquarePlus className="h-6.5 w-6.5" /> : <FaRegSquarePlus className="h-6.5 w-6.5" />}
                        <span className={`text-[10px] ${currentPath === "/createpost" ? "font-bold" : "font-normal"}`}>Post</span>
                    </div>
                    <div className="flex gap-1 flex-col items-center cursor-pointer" onClick={() => { currentPath === "/explore"; handleNavigate("/explore") }}>
                        {currentPath == "/explore" ? < MdExplore className="h-6.5 w-6.5" /> : <MdOutlineExplore className="h-6.5 w-6.5" />}
                        <span className={`text-[10px] ${currentPath === "/explore" ? "font-bold" : "font-normal"}`}>Explore</span>
                    </div>
                    <div className="flex gap-1 flex-col items-center cursor-pointer" onClick={() => { currentPath === "/profile"; handleNavigate("/profile") }}>
                        {currentPath == "/profile" ? <img src={Userdata?.user?.Image} className="h-6.5 border-1 border-gray-200 w-6.5 rounded-full" /> : <CgProfile className="h-6.5 w-6.5" />}
                        <span className={`text-[10px] ${currentPath === "/profile" ? "font-bold" : "font-normal"}`}>Profile</span>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default SideBar
