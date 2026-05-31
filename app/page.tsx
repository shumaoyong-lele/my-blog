// 导入首页静态数据
import homeData from "@/data/home.json"
// 导入获取文章的函数
import getPosts from "@/lib/posts"
// 导入文章列表组件
import { ArticleList } from "./components/ArticleList"

// 分类接口
interface Category {
    key: string    // 分类唯一标识
    short: string  // 简短名称
    full: string   // 完整名称
}

// 首页数据接口
interface HomeData {
    profile: {
        name: string   // 姓名
        role: string   // 职业/角色
        about: string  // 个人简介
    };
    topics: Array<{
        name: string   // 话题名称
        bg: string     // 背景色 CSS 类
        color: string  // 文字色 CSS 类
    }>;
    stats: {
        articles: string // 文章数量
        views: string    // 阅读量
        years: string    // 写作年限
    };
    socials: Array<{
        name: string    // 社交平台名称
    }>;
    categories: Category[]; // 分类列表
}

// 断言数据类型
const data = homeData as HomeData;

// 文章接口
interface Article {
    slug: string        // URL slug
    title: string       // 标题
    date: string        // 日期
    category: string    // 分类名称
    categoryKey: string // 分类标识
    excerpt: string     // 摘要
}

// 中文分类到英文标识的映射
const categoryMapping: Record<string, string> = {
    "前端": "frontend",
    "后端": "backend",
    "随笔": "essay",
};

/**
 * 从 Markdown 内容中提取纯文本摘要
 * @param content - Markdown 格式的文章内容
 * @param maxLength - 最大字符数，默认为 120
 */
function getExcerpt(content: string, maxLength: number = 120): string {
    // 去除 Markdown 语法符号
    const plainText = content.replace(/[#*`\[\]]/g, "").trim();
    // 如果内容长度在限制内，直接返回
    if (plainText.length <= maxLength) return plainText;
    // 否则截取前 maxLength 个字符并添加省略号
    return plainText.substring(0, maxLength).trim() + "...";
}

/**
 * 首页页面组件
 * 展示个人资料、统计信息、话题标签和文章列表
 */
export default async function HomePage() {
    // 获取所有文章
    const posts = await getPosts();

    // 将原始文章数据映射为 Article 格式
    const articles: Article[] = posts.map((post) => {
        // 获取第一个标签作为分类名
        const categoryName = (post.tags && post.tags.length > 0) ? String(post.tags[0]) : "Article";
        // 获取分类对应的英文标识
        const categoryKey = categoryMapping[categoryName] || "all";
        return {
            slug: post.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), // 生成 URL 友好的 slug
            title: post.title,
            date: post.date,
            category: categoryName,
            categoryKey,
            excerpt: getExcerpt(post.content || ""),
        };
    });

    return (
        // 页面容器：渐变背景
        <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-rose-50">
            <div className="max-w-360 mx-auto px-6 py-10 lg:px-12 lg:py-16 flex flex-col lg:flex-row gap-10 lg:gap-16 relative z-10">
                {/* 左侧边栏：个人资料 */}
                <aside className="lg:w-80 lg:sticky lg:top-10 lg:self-start">
                    <div className="lg:bg-white/80 lg:backdrop-blur-md lg:rounded-3xl lg:p-8 lg:shadow-xl lg:border lg:border-slate-200/50">
                        {/* 头像和基本信息 */}
                        <div className="mb-8">
                            {/* 头像：取名字首字母 */}
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white text-2xl font-bold mb-4">
                                {data.profile.name.charAt(0)}
                            </div>
                            {/* 姓名 */}
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">
                                {data.profile.name}
                            </h1>
                            {/* 职业 */}
                            <p className="text-slate-600 text-sm mb-4">{data.profile.role}</p>
                            {/* 个人简介 */}
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {data.profile.about}
                            </p>
                        </div>
                        {/* 话题标签 */}
                        <div className="mb-8">
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {data.topics.map((topic) => (
                                    <span
                                        key={topic.name}
                                        className={`${topic.bg} ${topic.color} text-xs font-medium px-3 py-1.5 rounded-full`}
                                    >
                    {topic.name}
                  </span>
                                ))}
                            </div>
                        </div>

                        {/* 社交媒体链接 */}
                        <div>
                            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                                Connect
                            </h3>
                            <div className="flex gap-3">
                                {data.socials.map((social) => (
                                    <button
                                        key={social.name}
                                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
                                        aria-label={social.name}
                                    >
                                        {/* 显示社交平台名称的首字母 */}
                                        <span className="text-sm capitalize">{social.name.charAt(0)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* 右侧文章列表 */}
                <ArticleList categories={data.categories} articles={articles} />
            </div>
        </div>
    );
}