# VibeGuide 项目设置说明

## 已完成的工作

### ✅ 阶段 1: 基础架构搭建
- [x] 安装所有依赖 (drizzle-orm, postgres, openai, jszip, react-markdown, remark-gfm, drizzle-kit, shadcn/ui components)
- [x] 创建 Drizzle ORM 数据库架构 (users, payments, projects 表)
- [x] 生成并应用数据库迁移
- [x] 创建 AI 客户端 (lib/ai/client.ts)
- [x] 创建 Zpay 支付客户端 (lib/payment/zpay.ts)
- [x] 创建文档下载工具 (lib/utils/download.ts)
- [x] 修正环境变量 (OPENROUTER_API_KEY)

### ✅ 阶段 2: Marketing 页面
- [x] 创建 Marketing 布局和导航
- [x] 创建首页落地页 (Hero, Features, Bento Grid, Stats, FAQ sections)
- [x] 创建价格页面

### ✅ 阶段 3: 支付功能集成
- [x] 创建支付创建 API (`/api/payment/create`)
- [x] 创建支付回调 API (`/api/payment/webhook`)

### ✅ 阶段 4: Dashboard 基础架构
- [x] 创建 Dashboard 布局和侧边栏
- [x] 创建 /my 页面 (用户信息和点数)
- [x] 创建 /projects 页面 (项目列表)
- [x] 创建项目 API routes (`/api/projects`)

### ✅ 阶段 5: AI 文档生成核心功能
- [x] 创建 AI 生成问题 API (`/api/ai/generate-questions`)
- [x] 创建 AI 生成文档 API (`/api/ai/generate-docs`)
- [x] 创建新建项目页面 (3步流程)
- [x] 创建共享组件 (Markdown Renderer, Loading Spinner, Confirm Dialog)

### ✅ 阶段 6: 项目详情页
- [x] 创建项目详情页 (`/projects/[id]`)
- [x] 支持查看历史项目和下载文档

## 🔧 需要手动完成的步骤

### 1. 在 Supabase SQL Editor 中执行触发器

运行 `supabase-trigger.sql` 文件中的 SQL 代码:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, project_credits)
  VALUES (new.id, new.email, 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. 更新 Zpay 支付配置

在 `lib/payment/zpay.ts` 中更新 Zpay API URL:
- 当前是占位符: `https://api.zpay.com/create`
- 需要替换为实际的 Zpay API 端点

根据 Zpay 实际的 API 文档更新:
- 签名算法（如果与 MD5 不同）
- 请求参数格式
- 回调参数格式

### 3. 测试完整流程

1. **注册和登录**
   ```bash
   pnpm dev
   # 访问 http://localhost:3000
   # 点击注册创建新账户
   ```

2. **充值测试**
   - 访问价格页面
   - 点击购买（需要 Zpay 配置完成）
   - 验证点数是否正确增加

3. **创建项目测试**
   - 访问 /projects/new
   - 输入项目描述（>20字符）
   - 验证 AI 生成问题
   - 回答问题并生成文档
   - 验证 5 种文档都正确生成
   - 测试下载功能

4. **查看项目测试**
   - 访问 /projects
   - 点击项目卡片
   - 验证所有数据正确显示

## 📝 环境变量检查清单

确保 `.env` 文件包含以下变量:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xwncdlsacuvlmdhhcrwd.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Database
DATABASE_URL=postgresql://...

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-...

# Zpay
ZPAY_PID=...
ZPAY_KEY=...

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000/
```

## 🚀 启动项目

```bash
cd with-supabase-app
pnpm install  # 如果还没安装依赖
pnpm dev
```

访问 http://localhost:3000

## 📋 待优化项目 (阶段 7)

这些是可选的优化，项目已经可以正常运行:

- [ ] 添加错误边界和更好的错误处理
- [ ] 添加加载状态骨架屏
- [ ] 添加表单验证 (使用 Zod)
- [ ] 添加草稿保存功能
- [ ] AI 生成失败重试机制
- [ ] 移动端响应式优化
- [ ] 性能优化（代码分割、图片优化）
- [ ] 添加更多测试

## 🐛 已知问题

1. **Zpay 支付**: 需要实际的 API 文档来完成集成
2. **环境变量**: 确保 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 已正确设置

## 📚 技术栈

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Auth**: Supabase Auth
- **AI**: OpenRouter (GLM-5 model)
- **Payment**: Zpay
- **UI**: Tailwind CSS + shadcn/ui
- **State**: React Hooks

## 🔗 重要文件路径

### 数据库
- `lib/db/schema.ts` - 数据库表定义
- `lib/db/index.ts` - Drizzle 客户端
- `drizzle.config.ts` - Drizzle 配置

### API Routes
- `app/api/ai/generate-questions/route.ts` - AI 生成问题
- `app/api/ai/generate-docs/route.ts` - AI 生成文档
- `app/api/payment/create/route.ts` - 创建支付
- `app/api/payment/webhook/route.ts` - 支付回调
- `app/api/projects/route.ts` - 项目 CRUD
- `app/api/projects/[id]/route.ts` - 单个项目操作

### 页面
- `app/(marketing)/page.tsx` - 首页
- `app/(marketing)/pricing/page.tsx` - 价格页
- `app/(dashboard)/projects/page.tsx` - 项目列表
- `app/(dashboard)/projects/new/page.tsx` - 新建项目
- `app/(dashboard)/projects/[id]/page.tsx` - 项目详情
- `app/(dashboard)/my/page.tsx` - 我的账户

## 💡 提示

1. 确保数据库迁移已成功应用
2. 确保 Supabase 触发器已创建
3. 检查所有环境变量是否正确设置
4. 测试时建议使用较短的项目描述以节省 AI API 调用成本
5. 文档生成可能需要 20-60 秒，请耐心等待

## 📞 支持

如有问题，请检查:
1. 浏览器控制台的错误信息
2. 服务器终端的日志输出
3. Supabase Dashboard 的日志
4. 数据库表是否正确创建
