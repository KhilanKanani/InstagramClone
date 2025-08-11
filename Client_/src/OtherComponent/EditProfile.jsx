import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { SERVER_URL } from "../main";
import { setUserdata } from "../Redux/UserSlice";
import { useNavigate } from "react-router";
import SideBar from "./SideBar";
import { IoArrowBackSharp } from "react-icons/io5";

const EditProfile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { Userdata } = useSelector(state => state.User);

    const [Fullname, setFullname] = useState(Userdata?.user?.Fullname);
    const [Username, setUsername] = useState(Userdata?.user?.Username);
    const [Bio, setBio] = useState(Userdata?.user?.Bio);
    const [frontendImage, setfrontendImage] = useState(Userdata?.user?.Image);
    const [backendImage, setbackendImage] = useState("");
    const [loader, setLoader] = useState(false);
    const image = useRef(null);

    function handleImage(e) {
        let Image = e.target.files[0];
        setbackendImage(Image);
        setfrontendImage(URL.createObjectURL(Image));
    }

    async function handleEditProfile() {
        setLoader(true);
        try {
            if (Fullname == "") {
                toast.error("Fullname Is Required");
                setLoader(false);
                return;
            }

            if (Fullname.length > 15) {
                toast.error("Fullname Is Too Long");
                setLoader(false);
                return;
            }

            if (Username == "") {
                toast.error("Username Is Required");
                setLoader(false);
                return;
            }

            if (Username.length > 14) {
                toast.error("Username Is Too Long");
                setLoader(false);
                return;
            }

            let formdata = new FormData();

            formdata.append("Fullname", Fullname);
            formdata.append("Username", Username);

            if (Bio) {
                formdata.append("Bio", Bio);
            }

            if (backendImage) {
                formdata.append("Image", backendImage);
            }

            const result = await axios.put(`${SERVER_URL}/api/user/editprofile`, formdata, { withCredentials: true });
            dispatch(setUserdata(result.data));

            toast.success("Profile Updated Successfully");
            navigate(result.data?.user?.Fullname ? "/profile" : "/editprofile");
            setLoader(false);
        }

        catch (err) {
            console.log("EditProfile Error: ", err.message);
            setLoader(false);
        }
    }

    return (
        <div className="flex w-[100%] h-[100%]">
            <div className="lg:w-[17%] h-[100%]">
                <SideBar Fullname={Fullname}/>
            </div>

            <div className="lg:px-50 sm:px-30 px-1 lg:mt-10 mt-18 md:mb-10 mb-20 lg:w-[83%] h-[100%] ">
                <div className="flex gap-1 items-center">
                    {/* <p className='inline lg:hidden' onClick={() => navigate(`/profile`)}> <IoArrowBackSharp className='text-[22px] mt-1 mb-5 cursor-pointer' /></p> */}
                    <h1 className=" font-bold text-[22px] mb-2 lg:mb-5 cursor-pointer">Edit Profile</h1>
                </div>

                <div className="">
                    <div className="flex justify-between items-center lg:px-5 px-2 w-full bg-gray-100 h-[90px] rounded-xl mt-3">
                        <div className="flex items-center gap-5">
                            <input type="file" ref={image} accept="image/*" onChange={handleImage} hidden />
                            <img src={frontendImage || "ChatlyDp.png"} className="h-15 w-15 cursor-pointer rounded-full border-1 border-gray-200" onClick={() => image.current.click()} />
                            <div className="leading-2">
                                <p className="font-bold text-lg">{Userdata?.user?.Username}</p>
                                <p className="text-gray-600 text-[14px]">{Userdata?.user?.Fullname}</p>
                            </div>
                        </div>

                        <button className="text-white bg-blue-500 lg:px-4 px-2 hidden sm:block py-1.5 rounded-lg hover:bg-blue-600 font-semibold cursor-pointer" onClick={() => image.current.click()}>
                            Change Photo
                        </button>
                    </div>

                    <div className="mt-5 lg:mt-7">
                        <h2 className="font-bold text-lg mb-2 lg:mb-3">Full Name</h2>
                        <input type="text" value={Fullname} className="border border-gray-200 rounded-lg p-3 w-full " onChange={(e) => setFullname(e.target.value)} />

                    </div>

                    <div className="mt-5 lg:mt-7">
                        <h2 className="font-bold text-lg mb-2 lg:mb-3">Username</h2>
                        <input type="text" value={Username} className="border border-gray-200 rounded-lg p-3 w-full " onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="mt-5 lg:mt-7">
                        <h2 className="font-bold text-lg mb-2 lg:mb-3">Email</h2>
                        <input type="email" value={Userdata?.user?.Email || ''} className="border border-gray-200 rounded-lg p-3 w-full outline-0 bg-gray-200 text-gray-500 opacity-80" readOnly />

                    </div>

                    <div className="mt-5 lg:mt-7">
                        <h2 className="font-bold text-lg mb-2 lg:mb-3">Bio</h2>
                        <textarea
                            cols={20}
                            className="border border-gray-200 rounded-lg p-3 w-full resize-none "
                            value={Bio || ""}
                            onChange={(e) => setBio(e.target.value)}
                        >
                            {Userdata?.user?.Bio}
                        </textarea>
                    </div>

                    <div>
                        <p className="text-gray-500 text-[13px] mt-5">
                            Certain profile info, like your name, bio and links, is visible to
                            everyone.
                            <span className="text-blue-500 text-[13px]">
                                <a href="https://help.instagram.com/347751748650214?ref=igweb" target="_blank"> See what profile info is visible</a>
                            </span>
                        </p>
                    </div>

                    <div className="flex justify-end mt-5 w-full">
                        <button
                            className="text-white bg-blue-500 w-50 px-10 py-2.5 rounded-lg hover:bg-blue-600 font-semibold cursor-pointer"
                            disabled={loader}
                            onClick={handleEditProfile}
                        >
                            {loader ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;