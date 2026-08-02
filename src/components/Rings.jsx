// Concentric-ring hero visual: Vendors → Brands → Members → Measured ROI
export default function Rings() {
  const orbit = 'absolute font-sans text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ondarkmuted bg-ink2 border border-brownline/40 px-2.5 py-1.5 rounded-full whitespace-nowrap'
  return (
    <div className="relative aspect-square max-w-[440px] mx-auto grid place-items-center" aria-hidden="true">
      <span className={`${orbit} top-[2%] left-1/2 -translate-x-1/2`}><span className="text-orange">●</span> Sell with proof</span>
      <span className={`${orbit} left-[-4%] top-1/2 -translate-y-1/2`}>Build with confidence</span>
      <span className={`${orbit} right-[-4%] top-1/2 -translate-y-1/2`}>Measure what changed</span>
      <span className={`${orbit} bottom-[2%] left-1/2 -translate-x-1/2`}>Vendors → Brands → Members</span>

      <div className="absolute inset-0 rounded-full border border-brownline/30" />
      <div className="absolute inset-[13%] rounded-full border border-orange/25" />
      <div className="absolute inset-[27%] rounded-full border border-orange/40" />
      <div className="absolute inset-[41%] rounded-full border border-orange/60" />
      <div className="w-[44%] h-[44%] rounded-full border border-orange grid place-items-center text-center"
           style={{ background: 'radial-gradient(circle at 50% 35%, #2e2219, #1b1410)', boxShadow: '0 0 40px -6px rgba(221,106,43,0.5)' }}>
        <div>
          <div className="font-serif font-semibold text-[clamp(18px,3vw,26px)] text-ondark">Loyalty ROI</div>
          <div className="text-[10px] tracking-[0.18em] text-orange uppercase mt-1">Measured</div>
        </div>
      </div>
    </div>
  )
}
