import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/dbConnect';

// Purpose: Return all companies.
export async function GET(request) {
  try {
    const db = await dbConnect();
    const companies = await db.collection('companies').find({}).toArray();
    return NextResponse.json(companies);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch companies', error }, { status: 500 });
  }
}

// Purpose: Insert one company document.
export async function POST(request) {
  try {
    const db = await dbConnect();
    const body = await request.json();
    const result = await db.collection('companies').insertOne(body);
    return NextResponse.json(result.ops[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create company', error }, { status: 400 });
  }
}