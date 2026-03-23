import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { db, projects, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: '请提供邮箱地址' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: '请提供密码' },
        { status: 400 }
      );
    }

    // 使用提供的邮箱和密码验证用户身份
    const supabase = await createServerClient();
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    const userId = signInData.user.id;

    // 查找用户记录
    const userRecords = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // 删除用户的所有项目
    await db.delete(projects).where(eq(projects.userId, userId));

    // 删除用户记录（如果存在）
    if (userRecords.length > 0) {
      await db.delete(users).where(eq(users.id, userId));
    }

    // 登出当前会话
    await supabase.auth.signOut();

    // 从 Supabase Auth 中删除用户（需要 service_role key）
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
        const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
        if (deleteError) {
          console.error('Failed to delete auth user:', deleteError);
        }
      } catch (authErr) {
        console.error('Auth deletion error:', authErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: '注销账号失败，请稍后重试' },
      { status: 500 }
    );
  }
}
