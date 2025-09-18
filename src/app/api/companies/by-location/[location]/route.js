import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';

export async function GET(request, { params }) {
  try {
    const db = await dbConnect();
    const { location } = params;

    const searchResults = await db.collection('companies').find({ location: { $regex: location, $options: 'i' } }).toArray();

    if (searchResults.length === 0) {
      return NextResponse.json({ message: `No companies found in location: ${location}` }, { status: 404 });
    }
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search companies by location', error }, { status: 500 });
  }
}