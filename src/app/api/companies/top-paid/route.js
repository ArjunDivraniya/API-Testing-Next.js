import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../lib/dbConnect';

export async function GET(request) {
  try {
    const db = await dbConnect();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 5;

    // Correctly reference the 'salaryBand.base' field for both the query and the sort.
    const topPaidCompanies = await db.collection('companies')
      .find({ 'salaryBand.base': { $exists: true } })
      .sort({ 'salaryBand.base': -1 })
      .limit(Math.min(limit, 50))
      .toArray();

    return NextResponse.json(topPaidCompanies);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch top paid companies', error }, { status: 500 });
  }
}
