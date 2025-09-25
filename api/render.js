import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default async function handler(req, res) {
  try {
    const url = req.url

    let template = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf-8'
    )

    // 개발 환경에서는 Vite 개발 서버 사용
    if (process.env.NODE_ENV === 'development') {
      const vite = await import('vite')
      const server = await vite.createServer({
        server: { middlewareMode: true },
        appType: 'custom'
      })

      template = await server.transformIndexHtml(url, template)
      const { render } = await server.ssrLoadModule('/src/entry-server.js')
      const { html: appHtml } = await render(url)

      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } else {
      // 프로덕션 환경에서는 빌드된 파일 사용
      try {
        const { render } = await import('../dist/server/entry-server.js')
        const { html: appHtml } = await render(url)

        const html = template.replace(`<!--ssr-outlet-->`, appHtml)

        res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
      } catch (error) {
        console.error('SSR error:', error)
        // SSR 실패 시 클라이언트 렌더링으로 fallback
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
      }
    }
  } catch (e) {
    console.error('Render error:', e)
    res.status(500).end(e.stack)
  }
}