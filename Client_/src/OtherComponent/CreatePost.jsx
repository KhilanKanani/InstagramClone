import { useRef, useState } from "react";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { SERVER_URL } from "../main";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const CreatePost = () => {

    const { Userdata } = useSelector(state => state.User);

    const [Caption, setCaption] = useState("");
    const [frontendpost, setfrontendpost] = useState("");
    const [backendpost, setbackendpost] = useState("");
    const [loading, setloading] = useState(false);
    const image = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleImageUpload(e) {
        let Image = e.target.files[0];
        setbackendpost(Image);
        setfrontendpost(URL.createObjectURL(Image));
    }

    const handleSharePost = async () => {
        setloading(true);
        try {

            if (Caption === "") {
                toast.error("Caption Is Required");
                setloading(false);
                return;
            }

            let formData = new FormData();

            formData.append("Caption", Caption);

            if (backendpost) {
                formData.append("Image", backendpost);
            }

            const result = await axios.post(`${SERVER_URL}/api/post/createpost`, formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                });

            setloading(false);
            navigate("/profile")
        }

        catch (err) {
            console.log("SharePost Error :", err.message);
            setloading(false);
        }
    }

    return (
        <div className="flex w-[100%] h-[100%]">
            <div className="lg:w-[17%] h-[100%]">
                <SideBar loading={loading} />
            </div>

            <div className="xl:px-80 lg:px-40 md:px-30 sm:px-10 px-4 w-full lg:w-[83%] min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl px-6 py-6 flex flex-col gap-4">

                    {/* Top Header or User Info */}
                    {!frontendpost ? (
                        <p className="text-2xl font-bold text-gray-800">Create New Post</p>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-3 items-center">
                                <img
                                    src={Userdata?.user?.Image}
                                    className="h-11 w-11 rounded-full object-cover border border-gray-300"
                                />
                                <div className="flex flex-col justify-center">
                                    <p className="font-semibold text-md">{Userdata?.user?.Username}</p>
                                    <p className="text-gray-500 text-sm mt-[-2px]">{Userdata?.user?.Fullname}</p>
                                </div>
                            </div>

                            <div>
                                {frontendpost && (
                                    <button
                                        disabled={loading}
                                        onClick={handleSharePost}
                                        className="text-blue-600 cursor-pointer font-semibold hover:text-blue-700 transition"
                                    >
                                        {loading ? "Sharing..." : "Share"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* File Upload / Preview */}
                    <div className={`w-full ${!frontendpost ? "flex " : ""}`}>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={image}
                            onChange={handleImageUpload}
                        />
                        {!frontendpost ? (
                            <button
                                className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg border border-blue-500 transition-all duration-200"
                                onClick={() => image.current.click()}
                            >
                                Choose File
                            </button>
                        ) : (
                            <img
                                src={frontendpost}
                                className="rounded-md w-full object-fit border border-gray-300 p-2 lg:h-[470px] h-[250px] shadow-md"
                            />
                        )}
                    </div>

                    {/* Caption Textarea */}
                    <div>
                        <textarea
                            name="Caption"
                            rows={3}
                            placeholder="Write a caption..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                            value={Caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Optional Another File Upload */}
                    {frontendpost && (
                        <div>
                            <button
                                className="w-full px-4 cursor-pointer py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg border border-blue-500 transition-all duration-200"
                                onClick={() => image.current.click()}
                            >
                                Choose Another File?
                            </button>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CreatePost;
