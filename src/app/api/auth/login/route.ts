import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { dbConnect } from '../../../utils/dbConnect';
const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
    
    await dbConnect();
    try {

    const { email, password } = await req.json();

    const { _id, username, passwordHash } = await User.findOne({ email });
    if (!username) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    const isMatch = await bcrypt.compare(password, passwordHash);
    if (!isMatch) return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });

    const token = jwt.sign({ id: _id}, JWT_SECRET, { expiresIn: '1h' });
    return NextResponse.json({ token, username, _id });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
