import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY environment variable is not set');
}

// OpenRouter AI client using GLM-5 model
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const MODEL = 'z-ai/glm-5';

/**
 * Generate 3-5 deep questions based on project description
 */
export async function generateQuestions(description: string): Promise<string[]> {
  const prompt = `你是一位资深的产品经理和技术专家。用户提供了以下项目描述：

${description}

请根据这个描述，生成 5-7 个深入的问题，帮助更好地理解项目需求。问题应该涵盖：
1. 项目背景和目标 - 为什么做这个项目？解决什么问题？
2. 目标用户和使用场景 - 谁会用？在什么场景下使用？
3. 核心功能和业务逻辑 - 主要功能有哪些？业务流程如何？
4. UI/UX 和交互设计 - 界面风格？用户体验要求？
5. 技术实现和架构 - 技术栈选型？系统架构？
6. 数据模型和非功能需求 - 数据如何组织？性能、安全要求？

请直接返回问题列表，每行一个问题，使用数字编号（1. 2. 3. ...）。不要包含任何其他内容。`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  const content = completion.choices[0]?.message?.content || '';

  // Parse the questions from the response
  const questions = content
    .split('\n')
    .filter(line => /^\d+\.\s/.test(line.trim()))
    .map(line => line.replace(/^\d+\.\s*/, '').trim())
    .filter(q => q.length > 0);

  return questions.slice(0, 5); // Ensure max 5 questions
}

/**
 * Generate all 5 documents in parallel based on description and answers
 */
export async function generateDocuments(
  description: string,
  answers: string
): Promise<{
  userJourney: string;
  prd: string;
  frontend: string;
  backend: string;
  database: string;
}> {
  // Base context for all document generation
  const baseContext = `项目描述：
${description}

深入需求回答：
${answers}`;

  // Prompts for each document type
  const prompts = {
    userJourney: `${baseContext}

请生成专业详细的用户旅程地图文档（User Journey Map），使用 Markdown 格式。

要求：
1. 识别 2-3 个核心用户画像
2. 为每个画像绘制完整的用户旅程（使用 Mermaid 图表）
3. 分析每个触点的用户情绪、痛点和机会点
4. 提供改进建议

文档应包含：
- 用户画像描述
- 用户旅程图（Mermaid）
- 触点分析表格
- 优化建议`,

    prd: `${baseContext}

请生成专业详细的产品需求文档（PRD - Product Requirements Document），使用 Markdown 格式。

要求：
1. 文档结构完整（背景、目标、用户、功能、非功能需求等）
2. 功能需求使用用户故事格式（As a [user], I want [feature], so that [benefit]）
3. 包含优先级划分（P0/P1/P2）
4. 包含验收标准

文档应包含：
- 项目背景和目标
- 用户画像
- 功能需求列表（分优先级）
- 非功能需求
- 关键流程图（Mermaid）
- 验收标准`,

    frontend: `${baseContext}

请生成专业详细的前端设计文档（Frontend Design Document），使用 Markdown 格式。

要求：
1. 技术栈选型及理由
2. 组件层级结构（使用树形图）
3. 状态管理方案
4. 路由设计
5. API 接口调用规范
6. UI/UX 设计要点

文档应包含：
- 技术选型
- 项目结构
- 组件设计（列表和职责）
- 状态管理
- 路由表
- API 调用规范
- 样式规范`,

    backend: `${baseContext}

请生成专业详细的后端设计文档（Backend Design Document），使用 Markdown 格式。

要求：
1. 技术栈选型及理由
2. 系统架构图（Mermaid）
3. API 接口设计（RESTful 或 GraphQL）
4. 业务逻辑流程图
5. 安全性设计
6. 性能优化策略

文档应包含：
- 技术选型
- 系统架构
- API 接口文档（端点、参数、响应）
- 业务逻辑
- 认证授权方案
- 错误处理
- 性能优化`,

    database: `${baseContext}

请生成专业详细的数据库设计文档（Database Design Document），使用 Markdown 格式。

要求：
1. 数据库选型及理由
2. ER 图（Entity-Relationship Diagram，使用 Mermaid）
3. 完整的表结构设计（字段、类型、约束、索引）
4. 数据迁移策略
5. 备份和恢复方案

文档应包含：
- 数据库选型
- ER 图
- 表结构设计（详细字段定义）
- 索引设计
- 数据关系说明
- 迁移和版本管理`,
  };

  // Generate all documents in parallel
  const [userJourneyResult, prdResult, frontendResult, backendResult, databaseResult] =
    await Promise.all([
      openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts.userJourney }],
        temperature: 0.7,
        max_tokens: 16000,
      }),
      openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts.prd }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
      openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts.frontend }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
      openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts.backend }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
      openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompts.database }],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    ]);

  return {
    userJourney: userJourneyResult.choices[0]?.message?.content || '',
    prd: prdResult.choices[0]?.message?.content || '',
    frontend: frontendResult.choices[0]?.message?.content || '',
    backend: backendResult.choices[0]?.message?.content || '',
    database: databaseResult.choices[0]?.message?.content || '',
  };
}
