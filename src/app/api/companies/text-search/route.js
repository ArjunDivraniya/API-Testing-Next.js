import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

// Purpose: Full-text (or simple regex) search
export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const skill = searchParams.get('skill');

    let searchQuery = {};
    if (query) {
      searchQuery.name = { $regex: query, $options: 'i' };
    } else if (skill) {
      searchQuery['hiringCriteria.skills'] = { $regex: skill, $options: 'i' };
    }

    const searchResults = await db.collection('companies').find(searchQuery).toArray();
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to perform text search', error }, { status: 500 });
  }
}