import React from "react";
import Header from "./Header";
import Loader from "./Loader";
import { useSelector } from "react-redux";

function DefaultLayout(props) {
  const { loading } = useSelector((store) => store);
  return (
    <div className="mx-20 my-5 md:mx-5">
      {loading && <Loader />}
      <Header />

      <div className="content mt-5 border-2 h-[85vh] rounded-md p-5">
        {props.children}
      </div>
    </div>
  );
}

export default DefaultLayout;
