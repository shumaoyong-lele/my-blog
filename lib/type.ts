export interface PostMeta {
  order: number
  title: string
  date: string
  tags: string[]
}

export interface Post extends PostMeta {
  content: string
}