// 文章元数据接口
export interface PostMeta {
  order: number      // 文章排序权重，数值越小排越前
  title: string      // 文章标题
  date: string       // 发布日期
  tags: string[]     // 标签数组
}

// 文章完整数据类型，继承 PostMeta 并添加正文内容
export interface Post extends PostMeta {
  content: string    // Markdown 正文内容
}