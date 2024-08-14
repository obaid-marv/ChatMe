import { NextRequest, NextResponse } from 'next/server';
import User from '../../../models/User';
import { dbConnect } from '../../../utils/dbConnect';

export async function GET(req: NextRequest) {
    await dbConnect();
    const query = req.nextUrl.searchParams.get('query');
    console.log(query);

    try {
        const users = await User.find({
            username: { $regex: query, $options: 'i' } 
        }).select('_id username');

        if(!users)
          return NextResponse.json({message: "No users found"}, {status: 404} );  

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
    }
}
