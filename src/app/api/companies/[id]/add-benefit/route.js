import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { dbConnect } from '../../../../../../lib/dbConnect';

// Purpose: Push a new benefit to benefits array
export async function PATCH(request, { params }) {
  try {
    const db = await dbConnect();
    const { id } = params;
    const { benefit } = await request.json();

    if (!benefit) {
      return NextResponse.json({ message: 'Benefit field is required' }, { status: 400 });
    }

    const result = await db.collection('companies').updateOne(
      { _id: new ObjectId(id) },
      { $addToSet: { benefits: benefit } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: `Company with ID ${id} not found` }, { status: 404 });
    }
    const updatedCompany = await db.collection('companies').findOne({ _id: new ObjectId(id) });
    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add benefit', error }, { status: 500 });
  }
}