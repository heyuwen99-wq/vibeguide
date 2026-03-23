import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ exists: false });
    }

    // 先检查本地数据库
    const userRecords = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userRecords.length > 0) {
      return NextResponse.json({ exists: true });
    }

    // 再检查 Supabase Auth（需要 service_role key）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const adminClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        });

        // 使用 admin API 列出用户
        const { data } = await adminClient.auth.admin.listUsers();
        const existsInAuth = data?.users?.some(user => user.email === email);

        if (existsInAuth) {
          return NextResponse.json({ exists: true });
        }
      } catch (authErr) {
        console.error('Auth check error:', authErr);
      }
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json({ exists: false });
  }
}
