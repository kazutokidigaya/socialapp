import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { app, fireDb } from "../firebaseConfig";
import { useSelector, useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    dispatch({ type: "showLoading" });
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        getDoc(doc(fireDb, "users", user.uid)).then((user) => {
          localStorage.setItem(
            "Blog-user",
            JSON.stringify({ ...user.data(), id: user.id })
          );
          navigate("/");
          toast.success("Login Successfull");
        });
        dispatch({ type: "hideLoading" });
      })
      .catch((error) => {
        toast.error("Login Failed");
        dispatch({ type: "hideLoading" });
      });
  };
  useEffect(() => {
    if (localStorage.getItem("Blog-user")) {
      navigate("/");
    }
  });

  return (
    <div className="h-screen flex justify-between  flex-col overflow-x-hidden ">
      {loading && <Loader />}

      <div className="flex justify-start">
        <div className="h-40 bg-primary w-96 -skew-x-[25deg] -ml-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold skew-x-[25deg] text-white">
            BLOG
          </h1>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-[420px] flex flex-col space-y-5 card p-10">
          <h1 className="text-4xl text-primary font-semibold">Sign In</h1>
          <hr />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className="border border-purple-100-100 h-10 rounded-sm  focus:border-purple-500 pl-5"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="border border-purple-100 h-10 rounded-sm  focus:border-purple-500 pl-5"
          />
          <div className="flex justify-end">
            <button
              className="bg-primary h-10 rounded-sm px-10 text-white  "
              onClick={login}
            >
              LOGIN
            </button>
          </div>
          <hr />
          <Link to="/register" className="text-[14px] text-primary">
            NOT YET REGISTERD ? CLICK HERE TO REGISTER
          </Link>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-40 bg-primary w-96 skew-x-[25deg] -mr-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold -skew-x-[25deg] text-white">
            APP
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Login;
