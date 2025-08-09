import { useSelector } from 'react-redux';
import SideBar from '../OtherComponent/SideBar';
import { IoNotificationsOutline } from 'react-icons/io5';

const Notification = () => {
    const { Notification } = useSelector(state => state.Socket);
    console.log(Notification);

    return (
        <div className="flex w-full h-full">
            {/* Sidebar */}
            <div className="lg:w-[17%]">
                <SideBar />
            </div>

            {/* Notification List */}
            <div className="lg:w-[83%] pb-5 pt-10 lg:pt-0 px-4 w-full  overflow-auto scroll-smooth">
                {
                    Notification?.length > 0 &&
                    <h1 className="text-2xl font fixed font-bold pb-5 xl:px-50 lg:px-30 bg-white w-full pt-10 z-[10] text-gray-800">Notifications</h1>
                }
                {
                    Notification?.length > 0 ?
                        <div className="flex  xl:px-50 lg:px-30 lg:mr-40 flex-col mt-23 gap-5">
                            {
                                Notification.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 bg-white p-4 rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-shadow duration-300">
                                        <img src={item?.user?.Image || '/default-avatar.png'} alt="User" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                                        <div className="flex flex-col justify-between">
                                            <p className="text-lg font-semibold text-gray-800 flex items-center gap-1"> {item?.user?.Username || 'Unknown User'} <span>{item?.user?.Username === "Kk's" && <img src="BlueTik.png" className="h-3 w-3" />}</span></p>
                                            <p className="text-sm text-gray-600 mt-1"> {item?.message || 'No message available.'}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {
                                                    new Date(item?.createdAt || Date.now()).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <p>{item?.post?.Image}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        : <div className="h-[65vh] flex flex-col items-center justify-center mt-20 text-center text-gray-500">
                            <IoNotificationsOutline className="text-6xl mb-4 text-gray-400" />
                            <p className="text-xl font-semibold">No Notifications Yet</p>
                            <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                        </div>
                }
            </div>
        </div>
    );
};

export default Notification;
