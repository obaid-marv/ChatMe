import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
const MONGO_URI = process.env.MONGO_URI as string;


let cachedClient: mongoose.Mongoose | null = null;

export async function dbConnect() {
  if (cachedClient) return;

  if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
  }

  try {
    cachedClient = await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
