import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

// Purpose: Simple query helper: ?city=Hyderabad&minBase=30
export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const minBase = searchParams.get('minBase');
    const skill = searchParams.get('skill');

    const query = {};
    if (city) query.location = city;
    if (minBase) query['salaryBand.base'] = { $gte: parseFloat(minBase) };
    if (skill) query['hiringCriteria.skills'] = { $in: [skill] };

    const searchResults = await db.collection('companies').find(query).toArray();
    return NextResponse.json(searchResults);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to search companies', error }, { status: 500 });
  }
}