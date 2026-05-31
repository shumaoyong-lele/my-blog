"use client"

// 引入 React 状态管理和 Next.js 链接组件
import { useState } from "react"
import Link from "next/link"
// date-fns 用于日期格式化
import { format } from "date-fns"

// 分类接口
interface Category {
  key: string    // 分类唯一标识
  short: string  // 简短名称（用于按钮显示）
  full: string   // 完整名称
}

// 文章接口
interface Article {
  slug: string        // 文章 URL slug
  title: string       // 文章标题
  date: string        // 发布日期
  category: string    // 分类名称
  categoryKey: string // 分类标识
  excerpt: string     // 文章摘要
}

// 文章列表组件Props接口
interface ArticleListProps {
  categories: Category[] // 分类列表
  articles: Article[]     // 文章列表
}

/**
 * 文章列表组件
 * 支持按分类筛选，展示文章卡片列表
 */
export function ArticleList({ categories, articles }: ArticleListProps) {
  // 当前选中的分类，默认为 "all"（全部）
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // 根据选中的分类过滤文章
  const filteredArticles = selectedCategory === "all"
    ? articles
    : articles.filter(article => article.categoryKey === selectedCategory)

  return (
    <main className="flex-1 min-w-0">
      {/* 分类筛选按钮组 */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.key
              ? "bg-slate-900 text-white"         // 选中状态
              : "bg-white text-slate-600 hover:bg-slate-100" // 未选中状态
            }`}
          >
            {category.short}
          </button>
        ))}
      </div>

      {/* 文章卡片网格 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {filteredArticles.map((article, index) => (
          <article
            key={article.slug}
            className="group bg-white rounded-3xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1.5 flex flex-col h-full cursor-pointer"
          >
            <Link href={`/posts/${article.slug}`} className="flex flex-col h-full">
              {/* 文章封面区域 */}
              <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-slate-100 to-slate-200">
                {/* 根据索引奇偶性显示不同渐变色 */}
                {index % 2 === 0 ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-orange-100" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-100" />
                )}
                {/* 分类标签 */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* 文章内容区域 */}
              <div className="px-4 pb-4 flex flex-col flex-1">
                {/* 标题 */}
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-rose-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </div>

                {/* 摘要 */}
                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                {/* 底部信息栏：日期 + 阅读更多 */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  {/* 发布日期 */}
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="text-slate-400"
                    >
                      <rect
                        x="2"
                        y="2"
                        width="12"
                        height="12"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 5v3.5l2.5 1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-xs text-slate-500 font-medium">
                      {format(new Date(article.date), "MMM dd, yyyy")}
                    </span>
                  </div>
                  {/* 阅读更多（hover 时显示） */}
                  <div className="flex items-center gap-1 text-rose-600 text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>Read</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 8h8M9 5l3 3-3 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* 加载更多按钮 */}
      <div className="flex justify-center mt-12">
        <button className="load-more-btn px-8 py-3 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-stone-600 font-medium">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-slate-400"
          >
            <path
              d="M2 8a6 6 0 1 1 1.5 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M2 12V8h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Load More Articles</span>
        </button>
      </div>
    </main>
  )
}