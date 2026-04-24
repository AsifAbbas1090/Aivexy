import 'dotenv/config'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '')
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

function randomViews() {
  return Math.floor(Math.random() * 7800 + 200)
}

async function upsertUser(client: any, data: any) {
  const res = await client.query(
    `INSERT INTO "User" (id, name, email, password, role, bio, username, website, twitter, "createdAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
     ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, password=EXCLUDED.password
     RETURNING id`,
    [data.id, data.name, data.email, data.password || null, data.role, data.bio || null, data.username || null, data.website || null, data.twitter || null]
  )
  return res.rows[0].id
}

async function upsertCategory(client: any, data: any) {
  const res = await client.query(
    `INSERT INTO "Category" (id, name, slug, color, description)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, color=EXCLUDED.color
     RETURNING id`,
    [data.id, data.name, data.slug, data.color, data.description || null]
  )
  return res.rows[0].id
}

async function upsertTag(client: any, name: string) {
  const id = 'tag_' + slugify(name)
  await client.query(
    `INSERT INTO "Tag" (id, name, slug) VALUES ($1,$2,$3) ON CONFLICT (slug) DO NOTHING`,
    [id, name, slugify(name)]
  )
  return id
}

async function upsertPost(client: any, data: any) {
  const res = await client.query(
    `INSERT INTO "Post" (id, title, slug, excerpt, content, published, featured, sponsored, "readTime", views, "publishedAt", "authorId", "categoryId", "createdAt", "updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW(),NOW())
     ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, content=EXCLUDED.content, views=EXCLUDED.views
     RETURNING id`,
    [data.id, data.title, data.slug, data.excerpt, data.content, data.published, data.featured, data.sponsored, data.readTime, data.views, data.publishedAt, data.authorId, data.categoryId]
  )
  return res.rows[0].id
}

async function main() {
  const client = await pool.connect()
  console.log('🌱 Seeding database...\n')

  try {
    // Hash passwords
    const adminHash = await bcrypt.hash('admin123', 10)
    const sarahHash = await bcrypt.hash('author123', 10)

    // Users
    const adminId = await upsertUser(client, {
      id: 'user_admin',
      email: 'admin@aivexy.com',
      name: 'Aivexy Admin',
      role: 'ADMIN',
      username: 'admin',
      password: adminHash,
    })

    const sarahId = await upsertUser(client, {
      id: 'user_sarah',
      email: 'sarah@aivexy.com',
      name: 'Sarah Chen',
      role: 'AUTHOR',
      username: 'sarahchen',
      bio: 'AI researcher and technical writer covering the intersection of language models and content creation. Former ML engineer turned full-time blogger.',
      twitter: 'sarahchenai',
      website: 'https://sarahchen.dev',
      password: sarahHash,
    })

    console.log('✓ Users created')

    // Categories
    const catAiTools = await upsertCategory(client, { id: 'cat_ai_tools', name: 'AI Tools', slug: 'ai-tools', color: '#2563EB', description: 'Reviews and comparisons of AI writing and productivity tools.' })
    const catSeo = await upsertCategory(client, { id: 'cat_seo', name: 'SEO', slug: 'seo', color: '#059669', description: 'Search engine optimization strategies for AI-era content.' })
    const catProductivity = await upsertCategory(client, { id: 'cat_productivity', name: 'Productivity', slug: 'productivity', color: '#D97706', description: 'Workflows and systems for high-output content creation.' })
    const catPromptEng = await upsertCategory(client, { id: 'cat_prompt_eng', name: 'Prompt Engineering', slug: 'prompt-engineering', color: '#7C3AED', description: 'Techniques for writing better AI prompts.' })
    const catMonetization = await upsertCategory(client, { id: 'cat_monetization', name: 'Monetization', slug: 'monetization', color: '#DC2626', description: 'Strategies for monetizing your blog and writing skills.' })
    const catCaseStudies = await upsertCategory(client, { id: 'cat_case_studies', name: 'Case Studies', slug: 'case-studies', color: '#0891B2', description: 'Real-world examples of AI-assisted blogging success.' })
    const catEthics = await upsertCategory(client, { id: 'cat_ethics', name: 'AI Writing Ethics', slug: 'ai-writing-ethics', color: '#6B7280', description: 'Responsible and transparent use of AI in publishing.' })

    console.log('✓ Categories created')

    // Tags
    for (const tag of ['ai', 'writing', 'chatgpt', 'claude', 'seo', 'productivity', 'blogging', 'prompt-engineering', 'monetization', 'google']) {
      await upsertTag(client, tag)
    }
    console.log('✓ Tags created\n')

    // Posts
    const articles = [
      {
        id: 'post_1',
        title: 'GPT-4o vs Claude 3.5 Sonnet: Which AI Writing Assistant Wins in 2025?',
        slug: 'gpt-4o-vs-claude-3-5-sonnet-ai-writing-assistant-2025',
        excerpt: 'We tested both models on 50 real writing tasks — blog posts, emails, code comments, and creative fiction. Here is what the data shows.',
        categoryId: catAiTools,
        featured: true,
        publishedAt: daysAgo(3),
        readTime: 4,
        content: `Both GPT-4o and Claude 3.5 Sonnet represent the pinnacle of large language model capability for writing. In our 30-day test across 50 standardized tasks, we focused on fluency, instruction-following, factual accuracy, and creativity.\n\nClaude 3.5 Sonnet edged ahead on long-form coherence and maintaining a consistent tone across a 3,000-word article. GPT-4o responded faster and excelled at bullet-point summaries and data extraction.\n\nFor bloggers, Claude is the better drafting partner; for quick repurposing tasks, GPT-4o wins. Bottom line: use both, with Claude as your primary drafting tool and GPT-4o for reformatting content.`,
      },
      {
        id: 'post_2',
        title: 'How I Wrote 30 Blog Posts in 30 Days Using AI — And What Happened to My Traffic',
        slug: 'wrote-30-blog-posts-30-days-ai-traffic-results',
        excerpt: 'A transparent, numbers-driven breakdown of an experiment: AI-assisted content at scale, the SEO impact, and whether Google penalized the site.',
        categoryId: catCaseStudies,
        featured: false,
        publishedAt: daysAgo(12),
        readTime: 5,
        content: `In January 2025, I committed to publishing one article per day for a full month using AI as a co-writer. My workflow: I provided a detailed outline and sources, Claude drafted, I edited and added personal anecdotes, then published.\n\nBy day 30, organic traffic was up 340% compared to the same period the prior year. Google did not penalize the site. The key was quality control — every post went through two rounds of human editing and original research.\n\nThe lesson: AI content works when YOU are the editor, not just the prompter.`,
      },
      {
        id: 'post_3',
        title: 'The 7 Best AI Writing Tools for Bloggers in 2025 (Free and Paid)',
        slug: 'best-ai-writing-tools-bloggers-2025',
        excerpt: 'From Jasper to Sudowrite, we reviewed the top AI writing assistants specifically for bloggers who need SEO-ready content fast.',
        categoryId: catAiTools,
        featured: true,
        publishedAt: daysAgo(20),
        readTime: 6,
        content: `The AI writing tool market has matured significantly. For bloggers on a budget, Claude.ai free tier and ChatGPT free remain the strongest starting points. For SEO-focused content, Surfer SEO with its AI integration stands out.\n\nJasper AI is best for teams needing brand voice consistency. Writesonic excels at product descriptions. Rytr is the best pure value-for-money option at $9/month. Sudowrite is purpose-built for fiction writers.\n\nOur top recommendation: start with Claude free, upgrade to Pro when you hit the message limit, and add Surfer SEO only when your blog crosses 10,000 monthly visitors.`,
      },
      {
        id: 'post_4',
        title: 'Prompt Engineering for Bloggers: 15 Prompts That Actually Produce Publishable Drafts',
        slug: 'prompt-engineering-bloggers-15-prompts-publishable-drafts',
        excerpt: 'Stop getting generic AI output. These 15 battle-tested prompts produce blog drafts that require minimal editing before publishing.',
        categoryId: catPromptEng,
        featured: false,
        publishedAt: daysAgo(28),
        readTime: 7,
        content: `The difference between a mediocre AI draft and a publishable one is almost entirely in the prompt. Prompt 1: "Act as a senior tech journalist. Write a 1,200-word article about [TOPIC]. Use a journalistic tone, include 3 concrete examples, and end with an actionable takeaway."\n\nThe role assignment alone improves quality by 40% in our tests. Prompt 7, the "Counter-Argument Technique": "Write an article defending [CLAIM] but include one paragraph that acknowledges the strongest counterargument." This produces nuanced, trustworthy content.\n\nPrompt 12, the "Interview Simulation": "Pretend you interviewed 5 experts about [TOPIC]. Summarize their viewpoints in a roundup article format." The result reads like real journalism.`,
      },
      {
        id: 'post_5',
        title: 'Does AI Content Rank on Google in 2025? The Definitive Answer',
        slug: 'does-ai-content-rank-google-2025-definitive-answer',
        excerpt: 'After analyzing 1,200 AI-assisted articles across 40 websites, here is the definitive data on AI content and Google rankings.',
        categoryId: catSeo,
        featured: false,
        publishedAt: daysAgo(35),
        readTime: 5,
        content: `Google's official position has not changed: they rank content based on quality, helpfulness, and expertise — not on how it was produced. Our analysis of 1,200 articles across 40 websites showed AI-assisted content ranked equally well as human-written content when these conditions were met: original research or data was included, content had clear first-hand experience signals, and the writing was edited for readability and accuracy.\n\nPages that failed to rank were typically pure AI output with no editing, no internal links, and no unique perspective. The E-E-A-T framework remains the real ranking signal.`,
      },
      {
        id: 'post_6',
        title: 'How to Use Claude as Your Personal Blog Editor (Full Workflow)',
        slug: 'use-claude-personal-blog-editor-full-workflow',
        excerpt: 'A step-by-step system for using Claude to review, improve, and fact-check your blog posts before hitting publish.',
        categoryId: catProductivity,
        featured: false,
        publishedAt: daysAgo(45),
        readTime: 4,
        content: `Most bloggers use AI only to generate content. The smarter use is as an editor. Here is a four-step editing workflow using Claude.\n\nStep 1: Clarity pass — "identify every sentence that is unclear or could be misunderstood."\nStep 2: SEO pass — "suggest 3 places to naturally add the keyword [TARGET KEYWORD] without keyword stuffing."\nStep 3: Readability pass — "rewrite any paragraph above a Grade 10 reading level to be simpler, without losing meaning."\nStep 4: Fact-check flag — "list every specific statistic or claim in this article that should be verified with a source."\n\nThis workflow takes 20 minutes and dramatically improves output quality.`,
      },
      {
        id: 'post_7',
        title: 'Building a $3,000/Month Blog: The Realistic Timeline (With AI Acceleration)',
        slug: 'building-3000-month-blog-realistic-timeline-ai-acceleration',
        excerpt: 'A month-by-month roadmap showing exactly how to grow a new blog to $3,000 per month, using AI tools to compress the timeline.',
        categoryId: catMonetization,
        featured: false,
        publishedAt: daysAgo(55),
        readTime: 6,
        content: `Month 1-3: Foundation. Publish 3 articles per week (AI-assisted), focus entirely on long-tail keywords under 1,000 monthly searches. No monetization yet — DA is too low for AdSense to be meaningful.\n\nMonth 4-6: Traction. You should have 40-50 articles. Apply for AdSense. Target medium-competition keywords. Begin building an email list.\n\nMonth 7-9: Monetization. Launch a paid newsletter or digital product. Reach out to AI tool companies for sponsored posts ($200-$500/article is realistic at 5,000 monthly visitors).\n\nMonth 10-12: Scale. Hit Mediavine threshold (50,000 sessions) for 3-5x AdSense RPM. $3,000/month is achievable at roughly 80,000 monthly pageviews in the AI niche, which has RPMs of $15-$35.`,
      },
      {
        id: 'post_8',
        title: 'ChatGPT vs Claude vs Gemini: Full Writing Comparison (50 Tests, 2025)',
        slug: 'chatgpt-vs-claude-vs-gemini-writing-comparison-50-tests-2025',
        excerpt: 'We ran 50 identical writing tasks through all three major AI models. Here are the results, ranked by category.',
        categoryId: catAiTools,
        featured: false,
        publishedAt: daysAgo(62),
        readTime: 5,
        content: `We divided 50 tests into five categories: persuasive essays, technical tutorials, creative fiction, email copy, and SEO blog posts.\n\nChatGPT (GPT-4o) won on email copy and short-form persuasive content, producing punchy, conversion-focused writing. Claude 3.5 Sonnet won on technical tutorials and long-form blog posts, maintaining internal consistency across 4,000+ word pieces. Gemini Ultra won on factual accuracy and citing recent events, leveraging its real-time search capability.\n\nFor bloggers: Claude is the best all-around partner. For marketers who write a lot of email: GPT-4o. For news and current-events blogging: Gemini.`,
      },
      {
        id: 'post_9',
        title: 'The Truth About AI Plagiarism Detectors: Can They Spot Your AI Writing?',
        slug: 'ai-plagiarism-detectors-can-they-spot-ai-writing',
        excerpt: 'We ran 200 AI-generated articles through Originality.ai, Copyleaks, Turnitin, and GPTZero. The results are surprising.',
        categoryId: catEthics,
        featured: false,
        publishedAt: daysAgo(70),
        readTime: 4,
        content: `AI detection tools are in an arms race with AI generators — and right now, the detectors are losing. We ran 200 articles through four major tools: Originality.ai, Copyleaks, Turnitin, and GPTZero.\n\nResults: lightly edited Claude output fooled all four tools 62% of the time. Heavily edited content (human rewrites of 40% or more) fooled detectors 94% of the time. Pure AI output was detected correctly about 71% of the time on average.\n\nThe takeaway for ethical bloggers: AI detection tools are not reliable enough to be used as sole evidence of AI authorship. Your responsibility is transparency — if AI wrote a significant portion of your content, disclose it.`,
      },
      {
        id: 'post_10',
        title: 'How Notion AI Compares to Dedicated AI Writing Tools for Content Creators',
        slug: 'notion-ai-vs-dedicated-ai-writing-tools-content-creators',
        excerpt: 'Notion added AI features, but does it compete with purpose-built writing assistants? We tested it as a full content creation workspace.',
        categoryId: catAiTools,
        featured: false,
        publishedAt: daysAgo(80),
        readTime: 4,
        content: `Notion AI is tightly integrated into the best project management tool for content creators, which is its biggest advantage. You can outline, draft, and manage editorial calendars all in one place. However, the AI quality lags behind Claude and GPT-4o.\n\nNotion AI excels at: meeting notes → blog outline conversion, summarizing research, and rephrasing content. It falls short on: generating original long-form content, SEO optimization suggestions, and maintaining brand voice.\n\nOur verdict: Use Notion AI for content planning and organization. Use Claude or ChatGPT for actual drafting.`,
      },
      {
        id: 'post_11',
        title: '10 AI Tools That Replace Expensive Freelancers (For Bloggers on a Budget)',
        slug: '10-ai-tools-replace-expensive-freelancers-bloggers-budget',
        excerpt: 'From graphic design to SEO audits, these AI tools eliminate the need to hire freelancers for your blog operations.',
        categoryId: catProductivity,
        featured: false,
        publishedAt: daysAgo(90),
        readTime: 5,
        content: `Running a blog solo used to mean hiring a designer, an SEO consultant, a social media manager, and a VA. AI has eliminated most of those costs.\n\nFor images: Midjourney or Leonardo AI replace a $50/image stock photo budget. For SEO: Semrush's AI writing assistant + free Ahrefs webmaster tools replace a $500/month SEO consultant. For social media graphics: Canva AI with Magic Design replaces a designer. For video thumbnails: Adobe Firefly.\n\nTotal monthly cost to replace $2,000 in freelancer fees: approximately $80-$120 in AI subscriptions.`,
      },
      {
        id: 'post_12',
        title: 'The Ethics of AI-Assisted Blogging: A Framework Every Writer Should Read',
        slug: 'ethics-ai-assisted-blogging-framework-every-writer',
        excerpt: 'As AI becomes a standard writing tool, bloggers need a clear ethical framework. Here is a practical guide to transparent, responsible AI-assisted publishing.',
        categoryId: catEthics,
        featured: false,
        publishedAt: daysAgo(100),
        readTime: 4,
        content: `The ethics of AI writing are not about whether you use AI — it is about honesty, accuracy, and reader trust. Three principles should guide every AI-assisted blogger.\n\nFirst, disclose meaningfully: a small note at the bottom of articles written substantially with AI assistance is the minimum standard. Second, verify everything: AI models hallucinate. Every specific statistic, named person, and date should be verified against a primary source before publishing. Third, add original value: if your article adds nothing beyond what the AI generated — no unique experience, no original research, no distinct perspective — then you are publishing content for search engines, not readers.`,
      },
    ]

    for (const article of articles) {
      const postId = await upsertPost(client, {
        ...article,
        authorId: sarahId,
        published: true,
        sponsored: false,
        views: randomViews(),
      })
      console.log(`  ✓ ${article.title.slice(0, 60)}...`)
    }

    console.log('\n✅ Seed complete!')
    console.log('   Admin:  admin@aivexy.com  / admin123')
    console.log('   Author: sarah@aivexy.com  / author123')
    console.log('   Posts:  12')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
