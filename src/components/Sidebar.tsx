"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Adjust import if you're using a different version of Next.js
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { initializeAuth, logout } from '../redux/Auth/authSlice';
import { AppDispatch } from '../redux/store';

const Sidebar = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };


  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  return (
    <aside className="w-64 bg-blue-500 text-white h-screen shadow-md fixed">
      <div className="flex items-center justify-center h-16 bg-blue-600 shadow">
        <h1 className="text-2xl font-bold">ChatMe!</h1>
      </div>
      <nav className="mt-10">
        <ul>
          <li className="mb-4">
            <Link href="/chat" className="block py-2.5 px-4 rounded hover:bg-blue-600 transition duration-200">
              Chat
            </Link>
          </li>
        </ul>
        <div className="mt-10 px-4 flex flex-col space-y-3">
          {user ? (
            <>
              <div className="text-white">Hello, {user.username}</div>
              <button
                onClick={handleLogout}
                className="w-24 p-2 bg-white font-bold text-blue-400 rounded-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="w-24 p-2 bg-white font-bold text-blue-400 rounded-sm">
                Login
              </Link>
              <Link href="/signup" className="w-24 p-2 bg-white font-bold text-blue-400 rounded-sm">
                Signup
              </Link>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
