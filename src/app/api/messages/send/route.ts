// src/app/api/messages/send/route.ts
import type { NextRequest } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect'; // Adjust the path as needed
import Message from '../../../models/Message'; // Adjust the path as needed

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { senderId, receiverId, content } = await req.json();

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      status: 'sent'
    });

    await newMessage.save();

    return new Response(JSON.stringify(newMessage), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send message' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
