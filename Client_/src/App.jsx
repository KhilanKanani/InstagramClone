import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Components/Login";
import { Signup } from "./Components/Signup";
import Home from "./Components/Home";
import Logout from "./Components/Logout";
import Profile from "./Components/Profile";
import { useDispatch, useSelector } from "react-redux";
import FindUser from "./FindCurrentData/FindUser";
import { useEffect } from "react";
import EditProfile from "./OtherComponent/EditProfile";
import SuggestedUser from "./OtherComponent/SuggestedUser";
import Search from "./Components/Search";
import CreatePost from "./OtherComponent/CreatePost";
import ShowSelectProfile from "./OtherComponent/ShowSelectProfile";
import Explore from "./Components/Explore";
import Messages from "./Components/Messages";
import ShowSelectPost from "./OtherComponent/ShowSelectPost";
import EditPost from "./OtherComponent/EditPost";
import Reels from "./Components/Reels";
import Notification from "./Components/Notification";
import ProfileData from "./OtherComponent/ProfileData";
import { io } from "socket.io-client";
import { SERVER_URL } from "./main";
import { setNotification, setOnlineUser, setSocket } from "./Redux/SocketSlice";

const App = () => {

  const dispatch = useDispatch();
  const { Userdata, Loading } = useSelector(state => state.User);

  useEffect(() => {
    dispatch(FindUser());
  }, []);

  useEffect(() => {
    if (Userdata) {
      const socketIO = io(SERVER_URL, {
        query: {
          userId: Userdata?.user?._id
        }
      });

      dispatch(setSocket(socketIO));

      socketIO.on("notification", (notification) => {
        dispatch(setNotification(notification));
      })
      
      // Listening All The Evene
      socketIO.on("onlineUser", (data) => {
        dispatch(setOnlineUser(data));
      });

      return () => {
        socketIO.close();
        dispatch(setSocket(null));
        dispatch(setOnlineUser(null));
      }
    }
    else {
      dispatch(setSocket(null));
      dispatch(setOnlineUser(null));
    }

  }, [Userdata])

  if (Loading) {
    return <div className="h-[100vh] text-xl flex flex-col gap-5 relative justify-center items-center">
      {/* <img src="instgramLogo.webp" className="w-15 h-15 relative" /> */}
      <div className='animate-spin h-10 w-10 border-5 border-l-purple-600 border-r-gray-500 border-t-red-600 border-b-blue-600 rounded-full'></div>

      <div className="absolute bottom-5 flex flex-col items-center justify-center">
        <p className="text-gray-400 text-sm">from</p>
        <p className='font-semibold text-[16px]'>&copy;2025 - Kk's</p>
      </div>
    </div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element:
        <div>
          {
            Userdata ? <Home /> : < Login />
          }
        </div>,
    },

    {
      path: "/login",
      element:
        <div>
          {
            !Userdata ? <Login /> : < Home />
          }
        </div>
    },

    {
      path: "/signup",
      element:
        <div>
          {
            !Userdata ? <Signup /> : <EditProfile />
          }
        </div>
    },

    {
      path: "/profile",
      element:
        <div>
          {
            Userdata ? <Profile /> : <Login />
          }
        </div>,
    },

    {
      path: "/editprofile",
      element:
        <div>
          {
            Userdata ? <EditProfile /> : <Login />
          }
        </div>,
    },

    {
      path: "/logout",
      element:
        <div>
          {
            Userdata ? <Logout /> : <Login />
          }
        </div>,
    },

    {
      path: "/suggestedUser",
      element:
        <div>
          {
            Userdata ? <SuggestedUser /> : <Login />
          }
        </div>,
    },

    {
      path: "/explore",
      element:
        <div>
          {
            Userdata ? <Explore /> : <Login />
          }
        </div>,
    },

    {
      path: "/message",
      element:
        <div>
          {
            Userdata ? <Messages /> : <Login />
          }
        </div>,
    },

    {
      path: "/search",
      element:
        <div>
          {
            Userdata ? <Search /> : <Login />
          }
        </div>,
    },

    {
      path: "/notification",
      element:
        <div>
          {
            Userdata ? <Notification /> : <Login />
          }
        </div>,
    },

    {
      path: "/createpost",
      element:
        <div>
          {
            Userdata ? <CreatePost /> : <Login />
          }
        </div>,
    },

    {
      path: "/reels",
      element:
        <div>
          {
            Userdata ? <Reels /> : <Login />
          }
        </div>,
    },

    {
      path: "/profiledata/:id",
      element:
        <div>
          {
            Userdata ? <ProfileData /> : <Login />
          }
        </div>,
    },

    {
      path: "/selectProfile/:id",
      element:
        <div>
          {
            Userdata ? <ShowSelectProfile /> : <Login />
          }
        </div>,
    },

    {
      path: "/postDetails/:id",
      element:
        <div>
          {
            Userdata ? <ShowSelectPost /> : <Login />
          }
        </div>,
    },

    {
      path: "/editpost/:id",
      element:
        <div>
          {
            Userdata ? <EditPost /> : <Login />
          }
        </div>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
};

export default App;