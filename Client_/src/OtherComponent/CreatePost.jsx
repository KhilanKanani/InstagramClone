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
            <div className="w-[17%] h-[100%]">
                <SideBar loading={loading} />
            </div>

            <div className="xl:px-80 lg:px-40 md:px-20 px-5 w-[83%] h-[100vh] flex items-center justify-center">
                <div className="px-5 py-5 border border-none shadow-xl bg-gray-100 w-full rounded-lg flex flex-col gap-4">
                    {
                        !frontendpost
                            ? <p className={`text-2xl font-bold ${frontendpost ? "border-b-1 pb-2.5 border-gray-300" : ""}`}>Create New Post</p>
                            : <div className='flex items-center justify-between'>
                                <div className="flex gap-3">
                                    <img src={Userdata?.user?.Image} className="h-11 w-11 rounded-full cursor-pointer border-1 border-gray-200" />

                                    <div className='flex flex-col justify-center'>
                                        <p className="font-semibold text-md">{Userdata?.user?.Username}</p>
                                        <p className="text-gray-600 text-[14px] mt-[-4px]">{Userdata?.user?.Fullname}</p>
                                    </div>
                                </div>

                                <div>
                                    {frontendpost && <button disabled={loading} onClick={handleSharePost} className="font-semibold text-blue-500 hover:text-blue-600 cursor-pointer mr-1">
                                        {!loading ? "Share" : "Sharing..."}
                                    </button>}
                                </div>
                            </div>
                    }

                    <div className={`flex ${!frontendpost ? "" : "justify-center"}`} >
                        <input type="file" accept="image/*" hidden ref={image} onChange={handleImageUpload} />
                        {
                            !frontendpost
                                ? <button className=" border border-gray-300 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer" onClick={() => image.current.click()}> Choose File </button>
                                : <img src={frontendpost} className="h-120 p-5 w-full border-1 rounded-md border-gray-300" />
                        }
                    </div>

                    <div>
                        <textarea
                            className="border border-gray-300 w-full px-2 py-1.5 resize-none outline-0 rounded-md"
                            name="Caption"
                            rows={3}
                            placeholder="Write a caption..."
                            value={Caption}
                            onChange={(e) => setCaption(e.target.value)}
                            disabled={loading}
                        ></textarea>
                    </div>

                    <div>
                        <input type="file" accept="image/*" hidden ref={image} onChange={handleImageUpload} />
                        {
                            frontendpost &&
                            <button className="w-full border border-gray-300 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer" onClick={() => image.current.click()}> Choose Another File ? </button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
