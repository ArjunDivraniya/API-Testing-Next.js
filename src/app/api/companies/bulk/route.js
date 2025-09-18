import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

// Purpose: Insert many companies at once (insertMany)
export async function POST(request) {
  try {
    const db = await dbConnect();
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: 'Request body must be an array' }, { status: 400 });
    }
    const result = await db.collection('companies').insertMany(body);
    return NextResponse.json({ message: `Inserted ${Object.values(result.insertedIds).length} companies`, insertedIds: Object.values(result.insertedIds) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to bulk insert companies', error }, { status: 400 });
  }
}