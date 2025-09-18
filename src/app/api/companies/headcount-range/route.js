import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const minHeadcount = parseInt(searchParams.get('min')) || 0;
    const maxHeadcount = searchParams.get('max') ? parseInt(searchParams.get('max')) : null;

    let query = { headcount: { $gte: minHeadcount } };
    if (maxHeadcount !== null) {
      query.headcount.$lte = maxHeadcount;
    }

    const searchResults = await db.collection('companies').find(query).toArray();
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search companies by headcount range', error }, { status: 500 });
  }
}