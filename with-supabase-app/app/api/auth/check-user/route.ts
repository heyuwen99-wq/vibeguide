import { NextRequest, NextResponse } from 'next/server';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ exists: false });
    }

    // 检查用户是否存在
    const userRecords = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return NextResponse.json({ exists: userRecords.length > 0 });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ exists: false });
  }
}
