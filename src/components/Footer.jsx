import { Link } from 'react-router-dom'
import { FOOTER, LEGAL_LINKS, BRAND } from '../content/site.js'

export default function Footer() {
  return (
    <footer className="bg-ink2 border-t border-[rgba(220,190,150,0.14)] pt-16 pb-8">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <div className="max-w-[34ch]">
            <div className="flex items-center gap-2.5 font-serif font-semibold text-ondark text-lg">
              <span className="rounded-lg bg-orange text-[#241206] grid place-items-center font-sans font-bold w-[26px] h-[26px] text-[13px]">A</span>
              Alma Loyalty
            </div>
            <p className="text-sm text-ondarkmuted mt-3.5">
              {BRAND.category}. {BRAND.vision} {BRAND.endorsement}
            </p>
          </div>
          {FOOTER.map((col) => (
            <div key={col.title}>
              <h5 className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-ondarkdim mb-4">{col.title}</h5>
              {col.links.map((l) => (
                <Link key={l.to} to={l.to} className="block text-sm text-ondarkmuted hover:text-orange py-1.5 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-[rgba(220,190,150,0.14)] mt-11 pt-6 flex flex-wrap justify-between gap-4 text-[13px] text-ondarkdim">
          <div>© {new Date().getFullYear()} Alma Loyalty. ROI figures are illustrative estimates for planning, not guarantees.</div>
          <div className="flex gap-4 flex-wrap">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-orange">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
