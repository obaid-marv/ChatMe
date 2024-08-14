import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/User';
import { dbConnect } from '../../../utils/dbConnect';
import { verifyToken } from '../../../middlewares/verifyToken';
import { JwtPayload } from 'jsonwebtoken'; // Import the JwtPayload type

export async function GET(req: NextRequest) {
  await dbConnect();

  // Get the token from cookies
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Authentication token is missing' }, { status: 401 });
  }

  // Verify the token
  const decodedToken = verifyToken(token);
  if (!decodedToken || typeof decodedToken === 'string') {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    // Fetch the user from the database based on the userId stored in the token
    const user = await User.findById((decodedToken as JwtPayload).id).select('_id username email');
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user data
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user data' }, { status: 500 });
  }
}
