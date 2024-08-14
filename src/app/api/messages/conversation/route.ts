import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import { verifyToken } from '../../../middlewares/verifyToken';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  // Get the token from cookies
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Authentication token is missing' }, { status: 401 });
  }

  // Verify the token
  const decodedToken = verifyToken(token);

  if (!decodedToken || typeof decodedToken === 'string') {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const currentUserId = (decodedToken as JwtPayload).id; // Access id safely after type guard

  if (!userId || !currentUserId) {
    return NextResponse.json({ error: 'Missing userId or currentUserId' }, { status: 400 });
  }

  await dbConnect();

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // Sort messages by creation time

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
