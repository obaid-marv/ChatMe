"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';

const ChatMessage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userId } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const username = searchParams.get('username');

  const [messages, setMessages] = useState<{ content: string; senderId: string }[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/conversation?userId=${userId}&currentUserId=${user?._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
  useEffect(() => {
    

    fetchMessages();
  }, [userId, user?._id]);

  useEffect(() => {
    const socketInstance = io('https://chatme-9ohf.onrender.com');
    setSocket(socketInstance);

    socketInstance.emit('user_connected', user?._id);

    socketInstance.on('private_message', (msg: { content: string; senderId: string }) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = { content: message, senderId: user?._id };

      setMessages((prevMessages) => [...prevMessages, newMessage]);

      socket.emit('private_message', { to: userId, content: message, senderId: user?._id });

      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Username display, adjust based on screen size */}
      <div className="fixed top-2 right-0 sm:right-4 p-4 w-96 bg-blue-400 rounded-sm sm:rounded-lg">
        <h2 className="font-bold text-white text-center sm:text-left">{username}</h2>
      </div>

      {/* Messages display area */}
      <div className="flex-1 pt-16 pb-16">
        <div className="p-4">
          {messages?.map((msg, index) => (
            <div key={index} className={`m-1 flex ${msg.senderId === user?._id ? "justify-end" : ""}`}>
              <p className={`py-2 px-4 rounded-full min-w-8 w-max ${msg.senderId === user?._id ? "bg-blue-400 text-white" : "bg-gray-300"}`}>
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Message input area */}
      <div className="fixed left-0 sm:left-72 bottom-0 right-0 p-2 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="w-5/6 sm:w-4/5 rounded-tl-full rounded-bl-full p-2 px-4 bg-gray-200 focus:outline-none placeholder-black"
        />
        <button
          className="w-1/6 sm:w-1/5 rounded-tr-full rounded-br-full p-2 text-white font-bold bg-blue-500"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;
