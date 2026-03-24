const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// 手动读取 .env 文件
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1].trim()] = match[2].trim();
  }
});

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    // 为现有用户创建记录
    await sql`
      INSERT INTO public.users (id, email, project_credits)
      SELECT id, email, 0 FROM auth.users
      ON CONFLICT (id) DO NOTHING
    `;
    console.log('✓ 已同步现有用户');

    // 创建触发器函数
    await sql.unsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public.users (id, email, project_credits)
        VALUES (new.id, new.email, 0);
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER
    `);
    console.log('✓ 已创建触发器函数');

    // 删除旧触发器
    await sql.unsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);

    // 创建新触发器
    await sql.unsafe(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()
    `);
    console.log('✓ 已创建触发器');

    console.log('\n全部完成！');
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await sql.end();
  }
}

run();
