// ==================== 导入依赖 ====================
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { format } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"

// ==================== 类型定义 ====================

/** 页面组件接收的路由参数 */
interface PageProps {
  params: Promise<{ slug: string }>
}

/** 分类标签的颜色配置 */
interface CategoryStyle {
  bg: string      // 背景色类名
  text: string    // 文字色类名
  border: string  // 边框色类名
}

// ==================== 分类颜色配置 ====================

/**
 * 分类标签对应的颜色样式
 * 保持与首页 ArticleList 组件中的配色逻辑一致
 */
const categoryColorMap: Record<string, CategoryStyle> = {
  "前端": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "后端": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "随笔": { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  "test": { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" },
}

// ==================== 数据获取 ====================

/**
 * 根据 slug 读取并解析 Markdown 文章
 * @param slug - 文章的文件名（不含扩展名）
 * @returns 文章数据或 null（文章不存在时）
 */
async function getPost(slug: string) {
  // 拼接 posts 目录的绝对路径
  const postsDirectory = path.join(process.cwd(), "posts")
  const filePath = path.join(postsDirectory, `${slug}.md`)

  // 文章文件不存在时返回 null，触发 404
  if (!fs.existsSync(filePath)) {
    return null
  }

  // 读取文件内容并解析 frontmatter 元数据
  const fileContents = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContents)

  // 将 Markdown 内容转换为 HTML
  const { remark } = await import("remark")
  const remarkHtml = await import("remark-html")
  const result = await remark().use(remarkHtml.default).process(content)

  return {
    title: data.title,      // 文章标题
    date: data.date,        // 发布日期
    tags: data.tags || [],  // 标签数组
    content: result.toString(), // 转换后的 HTML 内容
  }
}

// ==================== 元数据 ====================

/**
 * 生成页面元数据（用于 <head> 标签）
 */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.title} — 唐朝禹`,
    description: post.title,
  }
}

// ==================== 页面组件 ====================

/**
 * 文章阅读页面
 * 采用与首页一致的暖色渐变背景和现代卡片设计
 */
export default async function PostPage({ params }: PageProps) {
  // 获取路由参数中的 slug
  const { slug } = await params
  // 根据 slug 获取文章数据
  const post = await getPost(slug)

  // 文章不存在时显示 404 页面
  if (!post) {
    notFound()
  }

  // 获取分类标签名称，默认为 "Article"
  const categoryName = post.tags[0] || "Article"
  // 根据分类获取对应的颜色样式，找不到时使用默认灰色
  const categoryStyle = categoryColorMap[categoryName] || { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200" }

  return (
    // 页面容器：与首页一致的背景
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* ==================== 顶部导航栏 ==================== */}
      <nav className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-slate-200/30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 返回首页链接 */}
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors duration-200 group"
          >
            {/* 左箭头图标 */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            >
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-sm font-medium">返回首页</span>
          </Link>

          {/* 右侧头像标识 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            唐
          </div>
        </div>
      </nav>

      {/* ==================== 文章主体 ==================== */}
      <main className="max-w-4xl mx-auto px-6 py-10 lg:py-16">

        {/* 文章卡片容器：保持与首页设计语言统一 */}
        <article className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/50 overflow-hidden">

          {/* 顶部装饰条：彩虹渐变 */}
          <div className="h-2 bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400" />

          {/* 文章内容区域 */}
          <div className="px-8 py-10 lg:px-16 lg:py-12">

            {/* ==================== 文章头部 ==================== */}
            <header className="mb-10">

              {/* 分类标签 + 日期 */}
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border}`}
                >
                  {categoryName}
                </span>
                <span className="text-slate-300">·</span>
                <time className="text-sm text-slate-500">
                  {format(new Date(post.date), "yyyy 年 MM 月 dd 日")}
                </time>
              </div>

              {/* 文章标题 */}
              <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                {post.title}
              </h1>

              {/* 作者信息栏 */}
              <div className="flex items-center gap-4 py-6 border-y border-slate-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-lg font-bold shadow-md">
                  唐
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">唐朝禹</p>
                  <p className="text-xs text-slate-500">全栈开发者 · 独立创作者</p>
                </div>
              </div>
            </header>

            {/* ==================== 文章正文：Markdown 渲染 ==================== */}
            {/* 使用 Tailwind Typography (@tailwindcss/typography) 插件进行 Markdown 美化 */}
            <div
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-slate-900
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-5 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-100
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:mb-5
                prose-a:text-rose-500 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-rose-600
                prose-strong:text-slate-800 prose-strong:font-semibold
                prose-code:bg-slate-100 prose-code:text-rose-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-900 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:px-6 prose-pre:py-5 prose-pre:border prose-pre:border-slate-700/50
                prose-blockquote:border-l-4 prose-blockquote:border-l-rose-400 prose-blockquote:bg-rose-50/50 prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-slate-600
                prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200/50
                prose-ul:text-slate-600 prose-ul:leading-7 prose-li:text-slate-600 prose-li:mb-2
                prose-table:text-sm prose-table:text-slate-600
                prose-th:bg-slate-50 prose-th:text-slate-700 prose-th:font-semibold prose-th:px-4 prose-th:py-3
                prose-td:px-4 prose-td:py-3 prose-td:border-slate-100"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* ==================== 文章标签 ==================== */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* ==================== 底部导航 ==================== */}
        <footer className="mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-500 font-medium transition-colors duration-200 group"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className="group-hover:-translate-x-0.5 transition-transform duration-200"
            >
              <path
                d="M11 4L6 9l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>返回首页</span>
          </Link>
        </footer>
      </main>
    </div>
  )
}
