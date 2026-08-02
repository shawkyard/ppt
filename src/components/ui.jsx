import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export function Container({ children, className = '' }) {
  return <div className={`wrap ${className}`}>{children}</div>
}

// Alternating dark/light bands
export function Band({ tone = 'dark', id, className = '', children }) {
  const tones = {
    dark: 'bg-ink text-ondark',
    dark2: 'bg-ink2 text-ondark',
    light: 'bg-ivory text-onlight',
    cream: 'bg-cream2 text-onlight',
  }
  return (
    <section id={id} className={`py-[92px] ${tones[tone]} ${className}`}>
      {children}
    </section>
  )
}

export function Eyebrow({ children }) {
  return <span className="eyebrow mb-4">{children}</span>
}

// Renders a headline with one word/phrase highlighted in orange.
export function Headline({ text, highlight, as: Tag = 'h2', className = '' }) {
  if (!highlight || !text.includes(highlight)) {
    return <Tag className={className}>{text}</Tag>
  }
  const [before, after] = text.split(highlight)
  return (
    <Tag className={className}>
      {before}
      <span className="text-orange">{highlight}</span>
      {after}
    </Tag>
  )
}

export function SectionHead({ eyebrow, title, highlight, sub, tone = 'dark', center = true }) {
  const subColor = tone === 'dark' ? 'text-ondarkmuted' : 'text-onlightmuted'
  return (
    <Reveal className={`max-w-[660px] ${center ? 'mx-auto text-center' : ''} mb-14`}>
      {eyebrow && <div><Eyebrow>{eyebrow}</Eyebrow></div>}
      <Headline as="h2" text={title} highlight={highlight} className="text-[clamp(30px,4.4vw,50px)] font-semibold" />
      {sub && <p className={`text-lg mt-4 ${subColor}`}>{sub}</p>}
    </Reveal>
  )
}

export function Btn({ to, href, variant = 'primary', children, className = '', ...rest }) {
  const cls = {
    primary: 'btn-primary',
    'outline-dark': 'btn-outline-dark',
    'outline-light': 'btn-outline-light',
  }[variant]
  const content = (
    <>
      {children}
    </>
  )
  if (to) return <Link to={to} className={`${cls} ${className}`} {...rest}>{content}</Link>
  return <a href={href || '#'} className={`${cls} ${className}`} {...rest}>{content}</a>
}

export function Arrow() {
  return <span aria-hidden="true">→</span>
}

// Reveal-on-scroll wrapper
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.unobserve(el) } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    // Safety net: never leave content permanently hidden if the observer never fires.
    const t = setTimeout(() => setSeen(true), 2500)
    return () => { io.disconnect(); clearTimeout(t) }
  }, [])
  return (
    <Tag ref={ref} className={`fade-up ${seen ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}

// Card on light bands (cream)
export function Card({ icon, title, children, to, className = '' }) {
  const inner = (
    <>
      {icon && (
        <div className="w-11 h-11 rounded-[10px] bg-orangesoft text-orange grid place-items-center text-xl mb-4"
             style={{ background: 'rgba(221,106,43,0.12)' }}>{icon}</div>
      )}
      {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
      <div className="text-[14.5px] text-onlightmuted leading-relaxed">{children}</div>
    </>
  )
  const base = 'bg-cream border border-brownline/25 rounded-2xl p-7 transition-all hover:-translate-y-1 hover:shadow-warm'
  if (to) return <Link to={to} className={`block ${base} ${className}`}>{inner}</Link>
  return <div className={`${base} ${className}`}>{inner}</div>
}

// Card on dark bands
export function DarkCard({ icon, title, children, className = '' }) {
  return (
    <div className={`bg-ink3 border border-[rgba(220,190,150,0.14)] rounded-2xl p-7 ${className}`}>
      {icon && (
        <div className="w-11 h-11 rounded-[10px] text-orange grid place-items-center text-xl mb-4"
             style={{ background: 'rgba(221,106,43,0.12)' }}>{icon}</div>
      )}
      {title && <h3 className="text-xl font-semibold mb-2 text-ondark">{title}</h3>}
      <div className="text-[14.5px] text-ondarkmuted leading-relaxed">{children}</div>
    </div>
  )
}

// Illustrative-example note badge
export function IllustrativeNote({ children = 'Illustrative example — synthetic data for demonstration, not a client result.', tone = 'dark' }) {
  const c = tone === 'dark' ? 'text-ondarkdim border-brownline/40' : 'text-onlightmuted border-brownline/30'
  return (
    <p className={`text-xs mt-4 border-l-2 pl-3 ${c}`}>{children}</p>
  )
}
