import { useState } from "react";
import InstaLogo from "/InstaLogo.jpeg";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import { SERVER_URL } from "../main";
import { setLoading, setUserdata } from "../Redux/UserSlice";
import { useDispatch } from "react-redux";

export const Login = () => {

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loader, setloader] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setloader(true);

    try {
      if (Password == "" || Email == "") {
        toast.error("All Fields Are Required");
        setloader(false);
        return;
      }

      const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!pattern.test(Email)) {
        toast.error("Please Enter a Valid Email");
        setloader(false);
        return;
      }

      dispatch(setLoading(true));
      const result = await axios.post(`${SERVER_URL}/api/auth/login`, { Email, Password }, { withCredentials: true });
      dispatch(setUserdata(result.data));
      dispatch(setLoading(false));

      toast.success("Login successfull");
      navigate(result?.data?.user?.Fullname ? "/" : "/editprofile");
      setloader(false);
      setEmail("");
      setPassword("");
    }
    catch (err) {
      console.log("Login Error :", err.message);
      toast.error(err.response.data.message);
      setloader(false);
      dispatch(setLoading(false));
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center h-[510px] border-1 border-gray-400 px-5 rounded-sm">
        <img
          src={InstaLogo}
          className=" my-2 w-50 h-17 mix-blend-multiply mt-5"
        />

        <h1 className="text-[17px] font-semibold opacity-60 text-center mt-3 w-[320px]"> Login to see photos and videos from your friends </h1>

        <div className="flex flex-col gap-3 items-center mt-5 w-full">
          <input
            type="email"
            placeholder="Email"
            className="border p-1.5 w-full rounded-sm outline-0 border-gray-400 bg-gray-100"
            onChange={(e) => setEmail(e.target.value)}
            value={Email}
            disabled={loader}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-1.5 w-full rounded-sm outline-0 border-gray-400 bg-gray-100"
            onChange={(e) => setPassword(e.target.value)}
            value={Password}
            disabled={loader}
          />

          <div className="flex flex-col items-center justify-center mt-5 w-full">
            <button
              type="submit"
              className={`text-white p-2 w-full rounded-md cursor-pointer ${loader ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={handleLogin}
              disabled={loader}
            >
              {loader ? "Loading..." : "Login"}
            </button>
          </div>

          <div className="flex items-center justify-center mt-5 w-full">
            <hr className="border-gray-400 w-full" />
            <span className="px-3 font-semibold text-[15px] opacity-60">
              OR
            </span>
            <hr className="border-gray-400 w-full" />
          </div>

          <div className="flex items-center justify-center mt-1.5 gap-1">
            <p>Don't have an account ?</p>
            <span className="text-blue-500 font-bold cursor-pointer" onClick={() => navigate("/signup")}>Signup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
