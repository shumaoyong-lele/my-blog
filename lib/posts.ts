import * as fs from "fs"
import * as path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { dirname } from "path"

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 从 posts 目录读取所有 Markdown 文件并解析其元数据和内容
 * @returns 包含文章标题、日期、排序、标签和内容的数组，按 order 字段排序
 */
export default async function getPosts() {
  // 拼接 posts 目录的绝对路径
  const postsDirectory = path.join(__dirname, "..", "posts")
  // 获取所有 .md 文件
  const mdFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"))

  // 解析每个 Markdown 文件并提取元数据
  return mdFiles.map(i => {
    const filePath = path.join(postsDirectory, i)

    // 解析 frontmatter 元数据和正文内容
    const { data, content } = matter(fs.readFileSync(filePath, "utf-8"))
    return {
      title: data.title,
      date: data.date,
      order: data.order,
      tags: data.tags,
      content: content
    }
  }).sort((a,b) => a.order - b.order) // 按 order 字段升序排列
}