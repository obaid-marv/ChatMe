'use client'
import { AppDispatch, RootState } from '../redux/store';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from 'js-cookie';


const Home = () => {
  
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      router.push('/chat');
    }
    else{
      router.push('/login')
    }
  }, [router]);

  return (
    <div>
      <p></p>
    </div>

  );
}

export default Home;
