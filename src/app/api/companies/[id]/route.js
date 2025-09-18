import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { dbConnect } from '../../../../../../lib/dbConnect';

// Purpose: Push an interview round to interviewRounds array.
export async function PATCH(request, { params }) {
  try {
    const db = await dbConnect();
    const { id } = params;
    const { round, type } = await request.json();

    if (!round || !type) {
      return NextResponse.json({ message: 'Round and type are required' }, { status: 400 });
    }

    const result = await db.collection('companies').updateOne(
      { _id: new ObjectId(id) },
      { $push: { interviewRounds: { round, type } } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: `Company with ID ${id} not found` }, { status: 404 });
    }
    const updatedCompany = await db.collection('companies').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to push interview round', error }, { status: 500 });
  }
}