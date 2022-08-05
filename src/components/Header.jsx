import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { CgMenuRightAlt } from "react-icons/cg";

function Header() {
  const user = JSON.parse(localStorage.getItem("Blog-user"));
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const menuItems = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Add Post",
      path: "/addpost",
    },
    {
      title: "Shares",
      path: "/shares",
    },
    {
      title: "Profile",
      path: `/profile/${user.id}`,
    },
  ];

  return (
    <div className="p-3 bg-primary rounded-md ">
      {!showMenu && (
        <div className="md:flex justify-end   hidden bg-primary -mb-8">
          <CgMenuRightAlt
            size={30}
            color="white"
            className="cursor-pointer"
            onClick={() => setShowMenu(true)}
          />
        </div>
      )}

      {/**/}
      <div className="flex items-center justify-between ">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <h1 className="text-2xl font-semibold text-white ">Blog App</h1>
          <span className="text-purple-900">
            {user.email.substring(0, user.email.length - 10)}
          </span>
        </div>

        {/*webview*/}

        <div className="flex space-x-10 justify-end items-center  md:hidden">
          {menuItems.map((item) => {
            return (
              <Link
                to={`${item.path}`}
                className={`text-gray-300 ${
                  item.path === location.pathname &&
                  "bg-white text-black rounded py-1 px-3"
                }`}
                onClick={() => setShowMenu(false)}
              >
                {item.title}
              </Link>
            );
          })}
          <h1
            className="text-gray-300 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("Blog-user");
              navigate("/login");
            }}
          >
            LogOut
          </h1>
        </div>

        {/*mobileview*/}

        {showMenu && (
          <div className="md:flex space-x-10 justify-end flex-col items-end space-y-5 hidden">
            {menuItems.map((item) => {
              return (
                <Link
                  to={`${item.path}`}
                  className={`text-gray-300 ${
                    item.path === location.pathname &&
                    "bg-white text-black rounded py-1 px-3"
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
            <h1
              className="text-gray-200 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("Blog-user");
                navigate("/login");
              }}
            >
              LogOut
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
