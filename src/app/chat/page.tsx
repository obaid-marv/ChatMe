"use client";
import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Cookies from 'js-cookie';
import { getConvs } from '@/redux/Conversation/convSlice';
import MessageBar from '@/components/MessageBar';

const Chat = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [noUsersFound, setNoUsersFound] = useState(false);
  const router = useRouter();
  const { convs, status, error } = useSelector((state: RootState) => state.convs);
  console.log(convs?.messagesWithUsernames);
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setUsers([]);
      setNoUsersFound(false);
      return;
    }

    try {
      const response = await axios.get(`/api/users/search?query=${query}`);
      setUsers(response.data);
      setNoUsersFound(response.data.length === 0);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoUsersFound(true);
        setUsers([]);
      } else {
        console.error('Error searching users:', error);
      }
    }
  };

  const debouncedSearch = debounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  useEffect(()=>{
    const convsFunc = async () =>{
      await dispatch(getConvs())
    }
    convsFunc()
    

  },[])

  const handleUserClick = (userId: string, username: string) => {
    router.push(`/chat/${userId}?username=${username}`);
  };

  return (
    <div className="p-4 mt-16 sm:mt-8">
      <h2 className="text-xl font-semibold mb-4">Search for a User</h2>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="p-2 border rounded-md w-full"
        />
      </div>
      {noUsersFound && (
        <p className="text-red-500 mt-4">No users found</p>
      )}
      <ul className="mt-4 space-y-2">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => handleUserClick(user._id, user.username)}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
          >
            {user.username}
          </li>
        ))}
      </ul>
      {convs?.messagesWithUsernames.length==0 && 
      <div>
        <p>Start Chatting!</p>
      </div>}
      {convs?.messagesWithUsernames.map((val)=>{
        return(
          <MessageBar
          name={val.username}
          content={val.latestMessage.content}
          key={val.otherUserId}
          senderId={val.latestMessage.senderId}
          otherUserId={val.otherUserId}
          onClick={() => handleUserClick(val.otherUserId, val.username)}
          
          />
        )
      })}
    </div>
  );
};

export default Chat;
