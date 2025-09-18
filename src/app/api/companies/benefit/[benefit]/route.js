import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/dbConnect';

export async function GET(request, { params }) {
  try {
    const db = await dbConnect();
    const { benefit } = params;

    const searchResults = await db.collection('companies').find({ benefits: { $regex: benefit, $options: 'i' } }).toArray();

    if (searchResults.length === 0) {
      return NextResponse.json({ message: `No companies found with benefit: ${benefit}` }, { status: 404 });
    }
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search companies by benefit', error }, { status: 500 });
  }
}