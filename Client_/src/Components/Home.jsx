import { useNavigate } from 'react-router';
import SideBar from '../OtherComponent/SideBar'
import { useDispatch, useSelector } from 'react-redux'
import FindAllPost from '../FindCurrentData/FindAllPost';
import { FaRegHeart } from "react-icons/fa6";
import { RiSaveFill } from "react-icons/ri";
import { useEffect, useState } from 'react';
import { RiSaveLine } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { IoMenu } from 'react-icons/io5';
import toast from 'react-hot-toast';
import axios from 'axios';
import { SERVER_URL } from '../main';
import FindOtherUser from '../FindCurrentData/FindOtherUser';
import { setMessages } from '../Redux/MessageSlice';

const Home = () => {

  FindAllPost();
  FindOtherUser();

  const { Post } = useSelector(state => state.Post);
  const { Userdata, Otheruser } = useSelector(state => state.User);
  const { OnlineUser } = useSelector(state => state.Socket);
  const [followStates, setFollowStates] = useState({});
  const [savePostStates, setsavePostStates] = useState({});
  const [likeStates, setlikeStates] = useState({});
  const [likeCount, setlikeCount] = useState({});

  const [selectedReceiver, setSelectedReceiver] = useState({});
  const [sendLoading, setSendLoading] = useState(false);
  const [sendInput, setSendInput] = useState("");
  const [sendToggle, setSendToggle] = useState(null);
  const [toggle, setToggle] = useState(null);
  const [select, setselect] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFollowUnfollow = async (id) => {
    try {
      setLoading(true);
      await axios.post(`${SERVER_URL}/api/user/followOrUnfollow/${id}`, {}, { withCredentials: true });
      setFollowStates(prev => ({ ...prev, [id]: !prev[id] }));
      setLoading(false);
    }

    catch (err) {
      setLoading(false);
      console.log("FollowUnfollow Error :", err.message);
    }
  }

  const handleToggleLike = async (id) => {
    const isLiked = likeStates[id];
    setlikeStates(prev => ({ ...prev, [id]: !isLiked }));
    setlikeCount(prev => ({ ...prev, [id]: isLiked ? prev[id] - 1 : prev[id] + 1 }));

    if (isLiked) {
      await axios.get(`${SERVER_URL}/api/post/unlikepost/${id}`, { withCredentials: true });
    }
    else {
      await axios.get(`${SERVER_URL}/api/post/likepost/${id}`, { withCredentials: true });
    }
  };

  // const handleLikePost = async (id) => {
  //   try {
  //     await axios.get(`${SERVER_URL}/api/post/likepost/${id}`, { withCredentials: true });
  //     setlikeStates(prev => ({ ...prev, [id]: true }));
  //     setlikeCount(prev => ({ ...prev, [id]: prev[id] + 1 }));
  //     toast.success("Post Liked");
  //   }

  //   catch (err) {
  //     console.log("Like Error :", err.message);
  //   }
  // }

  // const handleUnLikePost = async (id) => {
  //   try {
  //     await axios.get(`${SERVER_URL}/api/post/unlikepost/${id}`, { withCredentials: true });
  //     setlikeStates(prev => ({ ...prev, [id]: false }));
  //     setlikeCount(prev => ({ ...prev, [id]: prev[id] - 1 }));
  //     toast.success("Post DisLiked");
  //   }

  //   catch (err) {
  //     console.log("DisLike Error :", err.message);
  //   }
  // }

  useEffect(() => {
    const followMap = {};
    Otheruser?.otherUser?.forEach(item => {
      followMap[item._id] = item?.Followers?.includes(Userdata?.user?._id);
    });
    setFollowStates(followMap);

    const savePostMap = {};
    Post?.Post?.forEach(item => {
      savePostMap[item._id] = Userdata?.user?.Saved?.includes(item._id);
    });
    setsavePostStates(savePostMap);

    const likePostMap = {};
    Post?.Post?.forEach(item => {
      likePostMap[item._id] = item?.Likes?.includes(Userdata?.user?._id);
    });
    setlikeStates(likePostMap);

    const likeCountMap = {};
    Post?.Post?.forEach(item => {
      likeCountMap[item._id] = item?.Likes?.length || 0;
    });
    setlikeCount(likeCountMap);
  }, [Otheruser, Userdata, Post]);

  const handleSavePost = async (id) => {
    try {
      const result = await axios.post(`${SERVER_URL}/api/post/savepost/${id}`, {}, { withCredentials: true });
      setsavePostStates(prev => ({ ...prev, [id]: !prev[id] }))
      toast.success(result.data.message);
    }

    catch (err) {
      console.log("SavePost Error :", err.message);
    }
  }

  const handleDeletePost = async (id) => {
    try {
      await axios.post(`${SERVER_URL}/api/post/deletepost/${id}`, {}, { withCredentials: true });
      toast.success("Post Deleted");
      navigate("/profile");
    }

    catch (err) {
      console.log("DeletePost Error :", err.message);
    }
  }

  const handleCopyLink = (id) => {
    const postUrl = `${window.location.origin}/postDetails/${id}`;
    toast.success("Copied To Clipboard");
    return navigator.clipboard.writeText(postUrl);
  }

  const handleSendPost = async (receiverId, imageUrl) => {
    try {
      if (!receiverId) {
        toast.error("Please select a receiver");
        return;
      }

      setSendLoading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const filename = imageUrl.split('/').pop();
      const file = new File([blob], filename, { type: blob.type });

      const formData = new FormData();
      formData.append('Image', file);
      formData.append("message", sendInput);

      const result = await axios.post(`${SERVER_URL}/api/message/sendmsg/${receiverId}`, formData, { withCredentials: true });

      if (result.data.success) {
        toast.success("Post Sent Successfully");
        dispatch(setMessages(prev => [...prev, result.data.messages]));
        setSendToggle(false);
      } else {
        toast.error("Failed to send post");
      }
      setSendLoading(false);
      setSendInput("");
    }

    catch (err) {
      console.log("SendPost Error:", err.message);
      toast.error("Failed to send post");
      setSendLoading(false);
      setSendInput("");
    }
  }

  useEffect(() => {
    if (Post?.Post && Otheruser?.otherUser) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [Post, Otheruser]);



  return (
    <div className='flex w-[100%] h-[100%]'>

      <div className='lg:w-[17%]'>
        <SideBar />
      </div>

       {/* Middle Section */}
      <div className='lg:w-[51%] w-full sm:px-30 px-1 lg:mt-5 mt-16 lg:mb-5 mb-15 overflow-auto h-full'>
        {
          loading
            ? <div className='flex flex-col gap-6' >
              {
                [1, 2, 3].map(i => (
                  <div key={i} className='border-b-2 border-gray-200 mt-3 pb-5 animate-pulse'>
                    <div className='flex items-center gap-3'>
                      <div className='h-11 w-11 bg-gray-300 rounded-full'></div>
                      <div className='flex flex-col gap-1'>
                        <div className='w-40 h-4 bg-gray-300 rounded'></div>
                        <div className='w-24 h-3 bg-gray-300 rounded'></div>
                      </div>
                    </div>

                    <div className='mt-4 w-full xl:h-100 h-90 bg-gray-300 rounded-md'></div>

                    <div className='flex justify-between mt-4'>
                      <div className='flex gap-4'>
                        <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                        <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                      </div>
                      <div className='w-6 h-6 bg-gray-300 rounded-full'></div>
                    </div>

                    <div className='mt-3 w-28 h-4 bg-gray-300 rounded'></div>
                  </div>
                ))
              }
            </div>

            : <div className="flex flex-col gap-1">
              {
                Post?.Post?.filter(item => followStates[item?.Author?._id]).length > 0 ?
                  Post?.Post?.map((item, index) => (
                    followStates[item?.Author?._id] &&
                    <div key={index} className='sm:m-3 mt-3 border-b-2 border-gray-300 pb-5'>

                      <div className='flex justify-between items-center'>
                        <div className='flex gap-3 px-0.5 cursor-pointer' onClick={() => Userdata?.user?._id == item?.Author?._id ? navigate("/profile") : navigate(`/selectProfile/${item?.Author?._id}`)}>
                          <div className='relative'>
                            <img src={item?.Author?.Image} className="h-11 w-11 rounded-full cursor-pointer" />
                            {
                              OnlineUser?.includes(item?.Author?._id) &&
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                            }
                          </div>

                          <div className='flex flex-col justify-center'>
                            <p className="font-semibold text-[17px]">{item?.Author?.Username}</p>
                            <p className="text-gray-600 text-[14px] mt-[-4px] flex items-center">{item?.Author?.Fullname} </p>
                          </div>
                        </div>

                        <div onClick={() => setSendToggle(null)}>
                          <div className='relative'>
                            <p><IoMenu onClick={() => setToggle((id) => (id == item?._id ? null : item?._id))} className='w-7 h-7 cursor-pointer' /></p>

                              <div className={`${toggle !== item?._id ? "hidden" : ""} sm:w-38 w-34 sm:text-[16px] text-sm  p-3 flex flex-col gap-1 rounded-lg bg-gray-100 absolute z-[10] right-0`}>
                              {
                                Userdata?.user?._id == item?.Author?._id &&
                                <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold text-red-600' onClick={() => handleDeletePost(item?._id)}>Delete</p>
                              }
                              {
                                Userdata?.user?._id == item?.Author?._id &&
                                <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => navigate(`/editpost/${item?._id}`)}>Edit</p>
                              }
                              {
                                Userdata?.user?._id !== item?.Author?._id &&
                                <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => handleFollowUnfollow(item?.Author?._id)} disabled={loading} >
                                  {
                                    followStates[item?.Author?._id]
                                      ? <span className='text-red-500'>UnFollow</span>
                                      : <span className='text-blue-600'>Follow</span>
                                  }
                                </p>
                              }
                              <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => navigate(`/postDetails/${item?._id}`)}>Go To Post</p>
                              <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => Userdata?.user?._id == item?.Author?._id ? navigate("/profile") : navigate(`/selectProfile/${item?.Author?._id}`)}>View AllPost</p>
                              <p className='p-1 hover:bg-gray-200 px-4 rounded-lg cursor-pointer text-center font-semibold' onClick={() => handleCopyLink(item?._id)}>Copy Link</p>
                              <p className='cursor-pointer p-1 hover:bg-gray-200 px-4 hover:rounded-lg text-center font-semibold border-t-1 border-gray-300' onClick={() => setToggle(false)}>Cancel</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <img src={item?.Image} onClick={() => window.open(item?.Image, "_blank")} className="cursor-pointer sm:mt-5 mt-3 border-1 border-gray-200 rounded-md h-90 w-full" />

                      <div className='flex justify-between items-center mt-3 px-0.5 relative'>
                        <div className='flex items-center gap-3'>
                          <p onClick={() => { setSendToggle(null), setToggle(null) }}>
                            {
                              likeStates[item?._id]
                                ? <FaHeart className="h-6.5 w-6.5 cursor-pointer text-red-600" onClick={() => handleToggleLike(item?._id)} />
                                : <FaRegHeart className="h-6.5 w-6.5 cursor-pointer" onClick={() => handleToggleLike(item?._id)} />
                            }
                          </p>

                          <p><LuSend className="h-6.5 w-6.5 mb-[-4px] cursor-pointer" onClick={() => setSendToggle(id => id == item?._id ? null : item?._id)} /></p>
                          {
                            sendToggle === item?._id &&
                              <div className='absolute lg:bottom-0 left-10 bottom-[30px] border border-gray-200 bg-white shadow-lg rounded-lg p-3 h-auto sm:w-80 w-fit z-10 flex flex-col gap-2'>
                              <p className='font-semibold text-gray-600'>Send this post to:</p>
                              <input type="text" placeholder="Write a message..." className="border rounded px-2 py-1.5 text-[15px] border-gray-300 outline-none" value={sendInput} onChange={(e) => setSendInput(e.target.value)} />

                              <div className='flex flex-col gap-1 max-h-50 overflow-y-auto'>
                                {
                                  Otheruser?.otherUser?.map(user => (
                                    followStates[user._id] &&
                                    <div key={user._id} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${selectedReceiver[item._id] === user._id ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => setSelectedReceiver(prev => ({ ...prev, [item._id]: user._id }))}>
                                      <div className='flex items-center gap-3'>
                                        <div className='relative'>
                                          <img src={user?.Image} className="h-10 w-10 rounded-full border border-gray-200" />
                                          {OnlineUser?.includes(user._id) && (
                                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                                          )}
                                        </div>
                                        <span className='font-semibold text-sm'>{user.Fullname}</span>
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>

                              <button className='cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-1 flex items-center justify-center rounded mt-2 text-sm font-semibold transition-all disabled:opacity-70' disabled={sendLoading} onClick={() => { handleSendPost(selectedReceiver[item._id], item.Image) }}>
                                {
                                  !sendLoading
                                    ? "Send"
                                    : <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                }
                              </button>
                            </div>
                          }
                        </div>

                        <p onClick={() => { setSendToggle(null), setToggle(null) }}>
                          {
                            savePostStates[item?._id]
                              ? <RiSaveFill className="h-6.5 w-6.5 cursor-pointer" onClick={() => handleSavePost(item?._id)} />
                              : <RiSaveLine className="h-6.5 w-6.5 cursor-pointer" onClick={() => handleSavePost(item?._id)} />
                          }
                        </p>
                      </div>

                      <p onClick={() => { setToggle(null), setSendToggle(null) }} className='font-semibold mt-2 px-0.5'>{likeCount[item?._id]} Likes</p>

                      <p onClick={() => { setToggle(null), setSendToggle(null) }} className='text-gray-500 mb-1.5 text-[13px] mt-1 px-0.5'>{new Date(item?.createdAt).toLocaleDateString("en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>

                      <div onClick={() => setSendToggle(null)} className='flex sm:flex-row flex-col sm:gap-1 mt-1 px-0.5'>
                        <span className='font-bold'>{item?.Author?.Username}</span>
                        <p className='sm:block hidden font-semibold'>-</p>
                        <p className={`cursor-pointer whitespace-pre-wrap ${select ? "" : "line-clamp-2"}`} onClick={() => setselect(prev => !prev)}>{item?.Caption}</p>
                      </div>

                    </div>
                  ))
                  : <div className="flex flex-col items-center justify-center h-[75vh]">
                    <img src="https://cdn-icons-png.flaticon.com/512/7476/7476247.png" alt="Find people illustration" className="w-40 h-40 mb-6 animate-pulse" />
                    <h2 className="text-2xl font-extrabold text-blue-700">Start Connecting with People!</h2>
                    <p className="text-base text-gray-600 mt-2 w-[75%] text-center">
                      You're not following anyone yet. Follow creators to fill your feed with amazing content and moments.
                    </p>
                    <button className="mt-6 px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300" onClick={() => navigate("/suggestedUser")}>
                      🔍 Discover People to Follow
                    </button>
                  </div>
              }
            </div>
        }
      </div> 

      {/* RightSideBar */}
      <div className='lg:w-[31%] hidden xl:pr-40 pr-10 mt-8 lg:flex flex-col gap-7 fixed right-0' onClick={() => { setToggle(null); setSendToggle(null) }}>
        <div className='flex justify-between items-center'>
          <div className='flex gap-3'>
            <img src={Userdata?.user?.Image} className="h-11 w-11 rounded-full cursor-pointer border-1 border-gray-200" onClick={() => navigate("/profile")} />

            <div className='flex flex-col justify-center'>
              <p className="font-semibold text-md">{Userdata?.user?.Username}</p>
              <p className="text-gray-600 text-[14px] mt-[-4px]">{Userdata?.user?.Fullname}</p>
            </div>
          </div>

          <p className='font-semibold text-blue-600 text-sm cursor-pointer' onClick={() => navigate("logout")}>Switch</p>
        </div>

        <div className='flex justify-between'>
          <p className='font-semibold text-sm text-gray-400'>Suggested for you</p>
          <p className='font-semibold text-[13.5px] cursor-pointer' onClick={() => navigate("/suggestedUser")}>Sell All</p>
        </div>

        {
          loading
            ? <div className='flex flex-col gap-3 mt-[-15px]'>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='h-11 w-11 bg-gray-300 rounded-full'></div>
                    <div className='flex flex-col gap-1'>
                      <div className='w-24 h-3 bg-gray-300 rounded'></div>
                      <div className='w-16 h-3 bg-gray-300 rounded'></div>
                    </div>
                  </div>
                  <div className='w-14 h-6 bg-gray-300 rounded'></div>
                </div>
              ))}
            </div>

            : <div className='flex flex-col gap-3 mt-[-15px]'>
              {
                Otheruser?.otherUser?.length > 0 && Otheruser?.otherUser?.slice(0, 5)?.map(item => (
                  <div key={item._id} className='flex justify-between items-center'>
                    <div className='flex gap-3 cursor-pointer' onClick={() => { navigate(`/selectProfile/${item._id}`) }}>
                      <div className='relative'>
                        <img src={item?.Image} className="h-11 w-11 rounded-full cursor-pointer border-1 border-gray-200" />
                        {
                          OnlineUser?.includes(item?._id) &&
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                        }
                      </div>

                      <div className='flex flex-col justify-center'>
                        <p className="font-semibold text-md">{item?.Username}</p>
                        <p className="text-gray-600 text-[14px] mt-[-4px]">{item?.Fullname}</p>
                      </div>
                    </div>

                    <button onClick={() => handleFollowUnfollow(item?._id)} disabled={loading} className='font-semibold text-blue-600 text-sm cursor-pointer' >{followStates[item._id] ? <p className='text-gray-400'>Following</p> : "Follow"}</button>
                  </div>
                ))
              }
            </div>
        }
        <div>
          <p className='font-semibold ml-1 text-gray-300 text-sm'>&copy;2025 - Present Kk's Pvt Ltd...</p>
        </div>
      </div>

    </div >
  )
}

export default Home
