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
  useEffect(()=>{
    if(!user){
      router.push('/login')
    }

  },[user])

  const username = searchParams.get('username');

  const [messages, setMessages] = useState<{ content: string; senderId: string }[]>([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/conversation?userId=${userId}&currentUserId=${user?._id}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [userId, user?._id]);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001');
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

      // Update the sender's screen immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Emit the message to the recipient via the socket
      socket.emit('private_message', { to: userId, content: message, senderId: user?._id });

      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
  <div className="fixed top-2 left-72 right-0 p-4 w-96 bg-blue-400 z-10 rounded-sm">
    <h2 className='font-bold text-white'>{username}</h2>
  </div>

  <div className="flex-1 pt-16 pb-16">
    <div className="p-4 ">
      {messages?.map((msg, index) => (
        <div key={index} className={`m-1 flex ${msg.senderId==user?._id?"justify-end":""}`}>
          <p className={`py-2 px-4 rounded-full min-w-8 w-max ${msg.senderId==user?._id?"bg-blue-400 text-white":"bg-gray-300"}`}>{msg.content}</p>
        </div>
      ))}
    </div>
  </div>

  <div className="fixed bottom-0 left-72 right-0 p-2 bg-gray-100 z-10 flex items-center">
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="Type a message"
      className="w-5/6 rounded-tl-full rounded-bl-full p-2 bg-gray-200 focus:outline-none placeholder-black"
    />
    <button
      className="w-1/6 rounded-tr-full rounded-br-full p-2 text-white font-bold bg-blue-500 ml-2"
      onClick={handleSendMessage}
    >
      Send
    </button>
  </div>
</div>



  );
};

export default ChatMessage;
