import SideBar from './SideBar'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { setSelectPost } from '../Redux/PostSlice';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../main';
import toast from 'react-hot-toast';
import { IoArrowBackSharp } from 'react-icons/io5';

const EditPost = () => {

    const { SelectPost } = useSelector(state => state.Post);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);
    const [loadingSave, setloadingSave] = useState(false);
    const [Caption, setcaption] = useState("");
    const [notFound, setNotFound] = useState(false);

    const handlePost = async () => {
        try {
            setloading(true);
            const result = await axios.get(`${SERVER_URL}/api/post/selectPost/${id}`, { withCredentials: true });

            if (!result.data?.selectPost) {
                setNotFound(true);
                return;
            }

            dispatch(setSelectPost(result.data?.selectPost));
            setloading(false);
        }

        catch (err) {
            console.log("EditPost Error :", err.message);
            setloading(false);
            setNotFound(true);
        }
    }

    const handleEditPost = async () => {
        try {
            setloadingSave(true);

            const result = await axios.put(`${SERVER_URL}/api/post/editpost/${id}`, { Caption }, { withCredentials: true });
            dispatch(setSelectPost(result.data));

            toast.success("Edit Post Successfull");
            navigate(`/postDetails/${id}`);
            setloadingSave(false);
        }

        catch (err) {
            console.log("EditPost Error :", err.message);
            setloadingSave(false);
        }
    }

    useEffect(() => {
        handlePost();
    }, [dispatch]);

    useEffect(() => {
        if (SelectPost?.Caption) {
            setcaption(SelectPost.Caption);
        }
    }, [SelectPost]);

    if (loading) {
        return (
            <div className='flex w-[100%] h-[100%]'>
                <div className='lg:w-[17%]'>
                    <SideBar />
                </div>

                <div className='lg:w-[83%] w-full xl:px-90 lg:px-50 px-4 lg:pt-10 pt-20 pb-5 animate-pulse'>
                    <div className='flex items-center gap-2'> 
                        <div className='h-6 w-6 rounded-full bg-gray-300 mb-5'></div>
                        <div className='h-6 w-32 bg-gray-300 rounded mb-5'></div>
                    </div>

                    <div className='w-full lg:h-[400px] h-[250px] bg-gray-200 rounded-lg mb-5'></div>

                    <div className='h-5 w-24 bg-gray-300 mb-2 rounded'></div>
                    <div className='h-20 w-full bg-gray-100 rounded-lg'></div>

                    <div className='mt-5 h-10 w-32 bg-gray-300 rounded'></div>
                </div>
            </div>
        )
    }

    if (notFound) {
        return (
            <div className='flex w-[100vw] h-[100vh]'>
                <div className='lg:w-[17%]'>
                    <SideBar />
                </div>
                <div className='lg:w-[83%] w-full lg:px-10 px-4 flex flex-col justify-center items-center text-center'>
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
                        alt="Not Found"
                        className="w-32 h-32 mb-6"
                    />
                    <h2 className='text-2xl font-bold text-gray-700 mb-2'>Post Not Found</h2>
                    <p className='text-gray-500 xs:w-80'>The post you are trying to edit does not exist or the ID is invalid.</p>
                    <button onClick={() => navigate('/')} className='cursor-pointer mt-4 px-5 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }


    return (
        <div className="flex w-full h-[100vh] bg-gray-50">

            {/* :: Sidebar :: */}
            <div className="lg:w-[17%]">
                <SideBar loadingSave={loadingSave} id={id} />
            </div>

            {/* :: Edit Form Content :: */}
            <div className="w-full lg:w-[83%] xl:px-90 lg:px-50 sm:px-40 px-4 lg:pt-10 pt-20 pb-6 overflow-auto scroll-smooth">

                <div className='flex gap-1 items-center mb-6'>
                    <p onClick={() => navigate(`/postDetails/${id}`)}> <IoArrowBackSharp className='text-[22px] mt-1 cursor-pointer' /></p>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
                </div>

                {/* :: Post Image :: */}
                <div className="mt-3">
                    <img
                        src={SelectPost?.Image}
                        className="rounded-lg border border-gray-300 w-full lg:h-[400px] object-fit h-[250px] shadow-md"
                    />
                </div>
 
                {/* :: Caption Edit :: */}
                <div className="mt-5">
                    <label className="block font-semibold text-lg mb-2 text-gray-800">Caption :</label>
                    <textarea
                        rows={3}
                        className="w-full p-3 rounded-md border border-gray-300 resize-none outline-none focus:ring-2 focus:ring-blue-400 transition"
                        value={Caption}
                        onChange={(e) => setcaption(e.target.value)}
                        placeholder="Update your caption..."
                    />
                </div>

                {/* :: Save Button :: */}
                <div className="mt-5">
                    <button
                        className={`px-5 py-2 rounded-md text-white font-semibold transition-all duration-200 shadow-sm ${loadingSave
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                            }`}
                        onClick={handleEditPost}
                        disabled={loadingSave}
                    >
                        {loadingSave ? "Saving..." : "Save Post"}
                    </button>
                </div>
            </div>
        </div>

    )
}

export default EditPost
