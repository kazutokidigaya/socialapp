import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { fireDb, app } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = () => {
    const auth = getAuth(app);
    dispatch({ type: "showLoading" });
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const userData = {
          email: user.email,
          profilePicUrl: "",
          bio: "hi, I am Using Blog App",
        };
        setDoc(doc(fireDb, "users", user.uid), userData);
        dispatch({ type: "hideLoading" });
        toast.success("Registration successfull");
        navigate("/login");
      })
      .catch((error) => {
        dispatch({ type: "hideLoading" });
        toast.error("Something went wrong");
        console.log(error);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("Blog-user")) {
      navigate("/");
    }
  });

  return (
    <div className="h-screen flex justify-between flex-col bg-primary overflow-x-hidden ">
      {loading && <Loader />}
      <div className="flex justify-start">
        <div className="h-40 bg-white w-96 -skew-x-[25deg] -ml-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold skew-x-[25deg] text-primary">
            BLOG
          </h1>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-[420px] flex flex-col space-y-5 card p-10">
          <h1 className="text-4xl text-white font-semibold">Sign Up</h1>
          <hr />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            className=" text-gray-400 border bg-transparent border-purple-100-100 h-10 rounded-sm  focus:border-purple-500 pl-5"
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-gray-400 border bg-transparent border-purple-100 h-10 rounded-sm  focus:border-purple-500 pl-5"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
            className=" text-gray-400 border bg-transparent border-purple-100 h-10 rounded-sm  focus:border-purple-500 pl-5"
          />
          <div className="flex justify-end">
            <button
              className="bg-white h-10 rounded-sm px-10 text-primary "
              onClick={register}
            >
              Register
            </button>
          </div>
          <hr />
          <Link to="/login" className="text-[14px]  text-white">
            ALREADY REGISTERD ? CLICK HERE TO LOGIN
          </Link>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="h-40 bg-white  w-96 skew-x-[25deg] -mr-10 flex items-center justify-center ">
          <h1 className="text-center text-6xl font-semibold -skew-x-[25deg] text-primary">
            APP
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Register;
