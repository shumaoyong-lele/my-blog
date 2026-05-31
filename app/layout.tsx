import "./globals.css"

export default function RootLayout({
  children, // 子组件/页面内容
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}