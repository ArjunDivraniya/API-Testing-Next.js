import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

// Purpose: Return total number of companies and optional counts by location.
export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    if (location) {
      const locationCount = await db.collection('companies').countDocuments({ location });
      return NextResponse.json({ location, count: locationCount });
    } else {
      const totalCount = await db.collection('companies').countDocuments({});
      return NextResponse.json({ total: totalCount });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to count companies', error }, { status: 500 });
  }
}