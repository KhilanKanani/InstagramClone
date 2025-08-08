import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "react-hot-toast";
import Store from "./Store/Store";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;
// export const SERVER_URL = "https://instagramclone-x0jt.onrender.com";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <Toaster />
    <App />
  </Provider>
);
