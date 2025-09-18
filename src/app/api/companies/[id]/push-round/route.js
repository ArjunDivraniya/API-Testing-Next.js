import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../../lib/dbConnect';


// Purpose: Push an interview round to interviewRounds array.
export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;
  const { round, type } = await request.json();

  if (!round || !type) {
    return NextResponse.json({ message: 'Round and type are required' }, { status: 400 });
  }

  try {
    const updatedCompany = await Company.findByIdAndUpdate(id, { $push: { interviewRounds: { round, type } } }, { new: true });
    if (!updatedCompany) {
      return NextResponse.json({ message: `Company with ID ${id} not found` }, { status: 404 });
    }
    return NextResponse.json(updatedCompany);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to push interview round', error }, { status: 500 });
  }
}