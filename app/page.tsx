import getPosts from "@/lib/posts";

export default async function Home() {
  const content = await getPosts()
  return (
      <div>
          <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">lele</h1>
          {content.map((post, i) => (
              <p key={i}>标题：{post.title}</p>
          ))}
          {content.map((post, i) => (
              <p key={i}>正文：{post.content}</p>
          ))}
      </div>
  );
}
