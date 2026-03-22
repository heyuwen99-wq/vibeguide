import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: '什么是 VibeGuide?',
    answer:
      'VibeGuide 是一个智能 AI 开发文档生成平台，帮助编程新手和开发者快速生成专业的项目开发文档，包括用户旅程地图、产品需求文档（PRD）、前端设计、后端设计和数据库设计。',
  },
  {
    question: '如何计费?',
    answer:
      '我们采用点数制计费。每生成一个完整项目（包含 5 种文档）消耗 1 个项目点数。您可以按需购买点数套餐：基础版 ¥20（10 点数）或进阶版 ¥40（30 点数）。',
  },
  {
    question: '生成的文档是什么格式?',
    answer:
      '所有文档都以 Markdown 格式生成，支持在线预览和下载。您可以选择下载单个文档的 .md 文件，或批量下载所有文档的 ZIP 压缩包。',
  },
  {
    question: 'AI 生成的文档质量如何?',
    answer:
      '我们使用先进的 GLM-5 大模型，生成的文档专业、详细、可直接用于项目开发。文档包含完整的结构、清晰的说明和实用的建议。当然，您也可以根据实际情况进行调整。',
  },
  {
    question: '可以重新生成文档吗?',
    answer:
      '每次生成都会消耗 1 个项目点数。如果您对生成的文档不满意，可以修改项目描述和需求回答后重新生成。已生成的历史项目文档会保存在您的账户中。',
  },
  {
    question: '支持哪些支付方式?',
    answer: '目前支持支付宝和微信支付。支付成功后，点数会自动充值到您的账户。',
  },
];

export function FaqSection() {
  return (
    <section className="relative container mx-auto px-4 py-24 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] animate-pulse" />

      <div className="relative mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl font-orbitron text-gradient-cyber">
            常见问题
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            了解更多关于 <span className="text-primary font-semibold">VibeGuide</span> 的信息
          </p>
        </div>

        <div className="relative border border-primary/20 rounded-xl p-6 bg-card/30 backdrop-blur-sm shadow-lg">
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-xl" />

          <Accordion type="single" collapsible className="w-full space-y-2">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-primary/10 rounded-lg px-6 bg-card/20 hover:bg-card/40 hover:border-primary/30 transition-all duration-300"
              >
                <AccordionTrigger className="text-left font-rajdhani font-bold hover:text-primary hover:no-underline transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
