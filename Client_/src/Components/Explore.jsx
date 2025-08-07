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
            <div className='lg:w-[17%]'>
                <SideBar />
            </div>

            <div className='lg:w-[83%] w-full md:px-20 px-4 lg:mt-5 mt-18 mb-5 overflow-auto h-full'>
                {
                    isLoading ? (
                        <div className="columns-2 sm:columns-3 gap-1 space-y-1">
                            {[...Array(9)].map((_, index) => (
                                <div key={index} className="bg-gray-300 animate-pulse aspect-square w-full" />
                            ))}
                        </div>
                    ) : Post?.Post?.filter(item => followStates[item?.Author?._id])?.length > 0 ? (
                        <div className="columns-2 sm:columns-3  gap-1 space-y-1">
                            {
                                Post?.Post?.map((item, index) => (
                                    followStates[item?.Author?._id] && (
                                        <div key={index} className="relative group  cursor-pointer">
                                            <img
                                                src={item?.Image}
                                                className="w-full h-auto object-cover border border-gray-200"
                                                onClick={() => navigate(`/postDetails/${item?._id}`)}
                                            />
                                        </div>
                                    )
                                ))
                            }
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[80vh] lg:h-[90vh] text-center">
                            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486817.png" alt="empty-state" className="w-40 h-40 mb-5" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nothing to Explore Yet</h2>
                            <p className="text-gray-500 text-sm mb-5 max-w-sm">
                                You're not following anyone yet. Start following interesting users to see their amazing posts here.
                            </p>
                            <button
                                onClick={() => navigate('/suggestedUser')}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                            >
                                Explore & Follow Users
                            </button>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Explore
