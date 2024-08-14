import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import User from '../../../models/User'; 
import { dbConnect } from '@/app/utils/dbConnect';

export async function POST(req: NextRequest) {
  
  
    await dbConnect();
    try {

    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) return NextResponse.json({ message: 'User email already exists' }, { status: 400 });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return NextResponse.json({ message: 'Username already exists' }, { status: 400 });


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password , passwordHash: hashedPassword });
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}