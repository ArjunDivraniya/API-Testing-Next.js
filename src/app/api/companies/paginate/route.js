import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

// Purpose: Pagination support: ?page=1&limit=10
export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    const paginatedResults = await db.collection('companies').find({}).limit(limit).skip(skip).toArray();
    return NextResponse.json(paginatedResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to paginate companies', error }, { status: 500 });
  }
}