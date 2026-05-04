import * as fs from "fs"
import * as path from "path"
import matter from "gray-matter"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function getPosts() {
  const postsDirectory = path.join(__dirname, "..", "posts")
  const mdFiles = fs.readdirSync(postsDirectory).filter(file => file.endsWith(".md"))
  
  return mdFiles.map(i => {
    const filePath = path.join(postsDirectory, i)
    const slug = i.replace(/\.md$/, "")
    const { data, content } = matter(fs.readFileSync(filePath, "utf-8"))
    return {
      title: data.title,
      date: data.date,
      order: data.order,
      tags: data.tags,
      content: content
    }
  }).sort((a,b) => a.order - b.order)
}