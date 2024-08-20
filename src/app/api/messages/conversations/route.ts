import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';
import Message from '../../../models/Message';
import User from '../../../models/User';
import { verifyToken } from '../../../middlewares/verifyToken';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

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
  
    const currentUserId = (decodedToken as JwtPayload).id;
  
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Missing currentUserId' }, { status: 400 });
    }
  
    await dbConnect();
    
    try {

        const messagesWithUsernames = await Message.aggregate([
            {
              $match: {
                $or: [
                  { senderId: new mongoose.Types.ObjectId(currentUserId) },
                  { receiverId: new mongoose.Types.ObjectId(currentUserId) },
                ],
              },
            },
            {
              $addFields: {
                otherUserId: {
                  $cond: {
                    if: { $eq: ['$senderId', new mongoose.Types.ObjectId(currentUserId)] },
                    then: '$receiverId',
                    else: '$senderId',
                  },
                },
              },
            },
            {
              $sort: { timestamp: -1 },
            },
            {
              $group: {
                _id: '$otherUserId',
                latestMessage: { $first: '$$ROOT' },
              },
            },
            {
              $lookup: {
                from: 'users', // Replace with your user collection name
                localField: '_id',
                foreignField: '_id', // Assuming user ID field in User model is '_id'
                as: 'user',
              },
            },
            {
              $unwind: '$user', // Unwind the 'user' array if it contains multiple documents
            },
            {
              $project: {
                _id: 0,
                otherUserId: '$_id',
                latestMessage: 1,
                username: '$user.username',
              },
            },
          ]);
      
      return NextResponse.json({ messagesWithUsernames });
    } catch (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
    }
  }
  