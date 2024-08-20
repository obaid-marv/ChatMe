"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { initializeAuth, logout } from "../redux/Auth/authSlice";
import { AppDispatch } from "../redux/store";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareCaretLeft } from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    { !isOpen &&
      <button
        className={"lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-500 text-white rounded focus:outline-none"}
        onClick={toggleSidebar}
      >
      Menu
      </button>}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 h-screen w-64 z-10 bg-blue-500 text-white shadow-md transform rounded-tr-2xl rounded-br-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-500 ease-in-out`}
      >
        <div className="flex items-center justify-around h-16 bg-blue-600 shadow rounded-tr-2xl">
          <h1 className="text-2xl font-bold">ChatMe!</h1>
          {isOpen&&
          <FontAwesomeIcon icon={faSquareCaretLeft} size={"2x"} onClick={toggleSidebar} className="lg:hidden"/>
          }
        </div>
        <nav className="mt-10 flex flex-col h-4/5 justify-between">
          <div>
            <ul>
              <li className="mb-4">
                <Link
                  href="/chat"
                  className="block py-2.5 px-4 font-bold rounded hover:bg-blue-600 transition duration-200"
                >
                  CHATS
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-10 px-4 flex flex-col space-y-3">
            {user ? (
              <>
                <div className="text-white">Hello, {user.username}</div>
                <button
                  onClick={handleLogout}
                  className="w-24 p-2 bg-white font-bold text-blue-400 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-24 p-2 bg-white font-bold text-blue-400 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-24 p-2 bg-white font-bold text-blue-400 rounded-lg"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>
      </aside>

    </>
  );
};

export default Sidebar;
