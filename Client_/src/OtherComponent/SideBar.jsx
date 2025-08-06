import { IoHome } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { IoChatboxEllipses } from "react-icons/io5";
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
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { IoSearchCircle } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const SideBar = ({ loading, loadingSave, id }) => {

    const [toggle, settoggle] = useState(false);
    const navigate = useNavigate();
    const { Userdata } = useSelector(state => state.User);
    const { Notification } = useSelector(state => state.Socket);

    const location = useLocation();
    const currentPath = location.pathname;

    const sideMenu = [
        { icon: currentPath == "/" ? <IoHome className="h-6.5 w-6.5" /> : <IoHomeOutline className="h-6.5 w-6.5" />, text: "Home", route: "/" },
        { icon: currentPath == "/search" ? <IoSearchCircle className="h-6.5 w-6.5" /> : <IoSearch className="h-6.5 w-6.5" />, text: "Search", route: "/search" },
        { icon: currentPath == "/message" ? <IoChatboxEllipses className="h-6.5 w-6.5" /> : <IoChatboxEllipsesOutline className="h-6.5 w-6.5" />, text: "Message", route: '/message' },
        { icon: currentPath == "/notification" ? <FaHeart className="h-6.5 w-6.5" /> : <FaRegHeart className="h-6.5 w-6.5" />, text: "Notification", route: "/notification" },
        { icon: currentPath == "/explore" ? < MdExplore className="h-6.5 w-6.5" /> : <MdOutlineExplore className="h-6.5 w-6.5" />, text: "Explore", route: "/explore" },
        { icon: currentPath == "/createpost" ? <FaSquarePlus className="h-6.5 w-6.5" /> : <FaRegSquarePlus className="h-6.5 w-6.5" />, text: "Create", route: "/createpost" },
        // { icon: currentPath == "/reels" ? <BsFillCameraReelsFill className="h-6.5 w-6.5" /> : <BsCameraReels className="h-6.5 w-6.5" />, text: "Reels", route: "/reels" },
        { icon: currentPath == "/profile" ? <img src={Userdata?.user?.Image} className="h-6.5 border-1 border-gray-200 w-6.5 rounded-full" /> : <CgProfile className="h-6.5 w-6.5" />, text: "Profile", route: "/profile" },
    ]

    function handleNavigate(routes) {
        if (Userdata?.user?.Fullname !== "") {
            navigate(routes);
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
        else {
            toast.error("Fullname Is Required");
            navigate("/editprofile");
        }

        settoggle(false);
    }


    return (
        <div className="w-[17%] h-full fixed top-0 left-0 bottom-0  py-3 flex flex-col bg-gray-50 border-r-1 border-gray-200">
            <img
                src={InstaLogo}
                alt="InstaLogo"
                className="px-6 w-42 h-12 mix-blend-multiply mt-5 fixed" />

            <div className="flex flex-col gap-5 mx-3 mt-23">
                {
                    sideMenu?.map((item, index) => {
                        return (
                            <div key={index} className="flex gap-5 cursor-pointer rounded-md px-3 py-2 hover:bg-gray-200" onClick={() => { handleNavigate(item?.route), settoggle(false) }}>
                                <div className="relative">
                                    <span>{item.icon}</span>
                                    {
                                        item.text === "Notification" && Notification?.length > 0 &&
                                        <p className="text-xs text-white w-5 h-5 flex items-center justify-center top-[-6px] left-[-10px] font-semibold bg-red-500 absolute rounded-full">
                                            {Notification.length}
                                        </p>
                                    }
                                </div>
                                <span className={`${currentPath === item?.route ? "font-bold" : "font-normal"}`}>{item.text}</span>
                            </div>
                        )
                    })
                }
            </div>

            <div className="flex flex-col gap-3 fixed w-[15.3%] bottom-3 mx-3">
                <div className={`flex gap-5 cursor-pointer px-3 py-2 rounded-md  hover:bg-gray-200`} onClick={() => { settoggle(prev => !prev) }}>
                    <span>{!toggle ? <IoMdMenu className="h-7 w-7" /> : <RxCross2 className="h-7 w-7" />}</span>
                    <span>Menu</span>
                </div>
            </div>

            {/* Toggle Menu */}
            <div className={`mx-3 px-3 rounded-lg py-3 fixed bottom-15 w-[10%] flex flex-col gap-2 font-semibold bg-gray-100 ${toggle ? "block" : "hidden"}`}>
                <p onClick={() => { handleNavigateProfile("Posts") }} className="cursor-pointer hover:bg-gray-200 p-1 px-2 rounded-md">Post</p>
                <p onClick={() => { handleNavigateProfile("Saved") }} className="cursor-pointer hover:bg-gray-200 p-1 px-2 rounded-md">Saved Post</p>
                <p className="cursor-pointer hover:bg-gray-200 p-1 px-2 hover:rounded-md border-t-1 border-gray-300" onClick={() => navigate("/logout")}>Logout</p>
            </div>

        </div>
    )
}

export default SideBar
