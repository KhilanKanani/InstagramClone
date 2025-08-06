import SideBar from '../OtherComponent/SideBar'
import { useSelector } from 'react-redux'
import FindAllPost from '../FindCurrentData/FindAllPost'
import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import FindOtherUser from '../FindCurrentData/FindOtherUser'

const Explore = () => {

    FindAllPost();
    FindOtherUser();
    const { Post } = useSelector(state => state.Post);
    const { Userdata, Otheruser } = useSelector(state => state.User);
    const navigate = useNavigate();
    const [followStates, setFollowStates] = useState({});

    useEffect(() => {
        const followMap = {};
        Otheruser?.otherUser?.forEach(item => {
            followMap[item._id] = item?.Followers?.includes(Userdata?.user?._id);
        });
        setFollowStates(followMap);
    }, [Otheruser, Userdata, Post]);

    const isLoading = !Post?.Post;

    return (
        <div className='flex w-full h-full'>
            <div className='w-[17%]'>
                <SideBar />
            </div>

            <div className='w-[83%] md:px-20 px-2 mt-8 mb-5 overflow-auto h-full'>

                {
                    isLoading
                        ? <div className="grid grid-cols-3 gap-1 w-full">
                            {[...Array(9)].map((_, index) => (
                                <div key={index} className="bg-gray-300 w-full animate-pulse rounded xl:h-100 lg:h-80 md:h-60 sm:h-50 h-30 w-ful" />
                            ))}
                        </div>

                        : Post?.Post?.filter(item => followStates[item?.Author?._id]).length > 0
                            ? Post?.Post?.map((item, index) => (
                                followStates[item?.Author?._id] &&
                                <div key={index} className="grid grid-cols-3 gap-1 w-full">
                                    <img src={item?.Image} onClick={() => navigate(`/postDetails/${item?._id}`)} className="cursor-pointer border border-gray-300 xl:h-100 lg:h-80 md:h-60 sm:h-50 h-30 w-full object-cover" />
                                </div>
                            ))
                            : <div className="flex flex-col mt-40 items-center justify-center h-full text-center px-4">
                                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486817.png" alt="empty-state" className="w-40 h-40 mb-6" />
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Discover Popular Users</h2>
                                <p className="text-gray-500 text-sm mb-6 w-120">You're not following anyone yet. Start following users you find interesting to see their posts here.</p>
                                <button onClick={() => navigate('/suggestedUser')} className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600 transition">
                                    Explore & Follow Users
                                </button>
                            </div>
                }

                {
                    Post?.Post?.filter(item => followStates[item?.Author?._id]).length > 0 &&
                    <p className='mt-5 font-semibold text-gray-300 text-center'>
                        &copy;2025 - Present Kk's Pvt Ltd...
                    </p>
                }

            </div>
        </div>
    )
}

export default Explore
