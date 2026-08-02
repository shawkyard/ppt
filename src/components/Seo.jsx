import { useEffect } from 'react'

// Lightweight per-page SEO: sets title + meta description + canonical + OG.
export default function Seo({ title, description, path }) {
  useEffect(() => {
    const full = title ? `${title} — Alma Loyalty` : 'Alma Loyalty — Loyalty ROI Intelligence & Decisioning'
    document.title = full

    const setMeta = (selector, attr, value) => {
      if (!value) return
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const [k, v] = selector.replace('meta[', '').replace(']', '').split('=')
        el.setAttribute(k, v.replace(/["']/g, ''))
        document.head.appendChild(el)
      }
      el.setAttribute(attr, value)
    }

    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
    }
    setMeta('meta[property="og:title"]', 'content', full)

    // canonical
    if (path) {
      let link = document.head.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', `https://alma-loyalty.com${path}`)
    }
  }, [title, description, path])

  return null
}
