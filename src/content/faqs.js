// FAQ content, organized by category, for the FAQ page. Home/other pages reuse subsets.
export const FAQ_CATEGORIES = [
  {
    title: 'General',
    items: [
      { q: 'What is Alma Loyalty?', a: 'Alma Loyalty is a Loyalty ROI Intelligence & Decisioning layer. It estimates whether a loyalty program can make money, how much, what is driving the return, and which decisions improve it—for both loyalty vendors and brands.' },
      { q: 'Is it for vendors or brands?', a: 'Both. It is vendor-first—helping loyalty software and service companies find and close the right accounts—and it also helps brands build the business case and improve their programs.' },
      { q: 'Does Alma replace my loyalty platform?', a: 'No. Loyalty platforms run programs, rewards, and member experiences. Alma is the ROI intelligence and decision layer that helps vendors and brands estimate opportunity, build the financial case, prioritize action, and measure results.' },
    ],
  },
  {
    title: 'Accuracy & methodology',
    items: [
      { q: 'Can Alma tell whether a company will make money with loyalty?', a: 'Alma can estimate the conditions under which a well-designed program is likely to produce positive incremental contribution—the required active membership, behavior lift, margin, cost, and payback thresholds. It cannot guarantee future behavior or execution. The purpose is to replace a vague promise with a transparent range and a clear list of what must be true.' },
      { q: 'Can you measure every loyalty program?', a: 'Alma is designed to model loyalty economics across many industries, channels, and program types. The result is only as strong as the evidence available, so Alma shows assumptions, scenarios, and confidence rather than pretending every program can be measured with identical precision. A company with detailed customer, transaction, margin, and cost data can receive a stronger measurement than one using only public benchmarks.' },
      { q: 'How accurate is the estimate?', a: 'Every estimate carries a confidence level based on data completeness, source quality, recency, comparability, and sensitivity. Results are shown as ranges, not single precise numbers the inputs cannot support.' },
      { q: 'Does Alma count all member revenue as loyalty revenue?', a: 'No. Alma focuses on measurable change that can reasonably be attributed to loyalty—incremental purchase frequency, order value, retention, and cross-sell—then evaluates that value after the relevant program costs.' },
      { q: 'How are benchmarks selected?', a: 'Benchmarks are chosen for comparability to your business model, channel, and pricing position, and are clearly labeled as estimates. Actual company data always takes priority over a benchmark.' },
      { q: 'What is included in program cost?', a: 'Reward and redemption cost, points liability where relevant, plus technology, implementation, staffing, service, and ongoing operating costs—not just points.' },
    ],
  },
  {
    title: 'Data & privacy',
    items: [
      { q: 'What if I do not have all the data?', a: 'Every input accepts an estimate. Where an input is assumed, the result identifies the assumption and its confidence level so it can be replaced as better data becomes available.' },
      { q: 'How do you know a company’s metrics?', a: 'Alma uses the best available combination of company-provided data, program data, public company information, relevant external sources, comparable business and channel evidence, and clearly labeled assumptions. Actual company data takes priority.' },
      { q: 'How is sensitive company data protected?', a: 'Confidential inputs are handled server-side with least-privilege access and isolation. Uploaded lists, assumptions, and reports are never exposed in client-side code or public storage. See the Security & Data Use page for detail.' },
      { q: 'What is public versus gated?', a: 'Methodology, glossary, educational content, high-level calculator results, and example outputs are public. Detailed reports, saved scenarios, company-specific assumptions, CRM uploads, and dashboards are gated.' },
    ],
  },
  {
    title: 'For vendors',
    items: [
      { q: 'Can Alma score a CRM list?', a: 'Yes. Pre-Scope Intelligence ingests a company list or CRM records, evaluates economic fit, and returns ranked accounts with evidence, confidence, and a recommended next action.' },
      { q: 'Can vendors brand the calculator as their own?', a: 'Yes. White-label experiences carry your brand and sales process; Alma supplies the methodology and decision layer underneath.' },
      { q: 'Does it fit our existing sales process and CRM?', a: 'Yes. Alma layers ROI intelligence onto your stages and connects through API or approved integrations rather than replacing your motion.' },
    ],
  },
  {
    title: 'For brands',
    items: [
      { q: 'Can I audit an existing program?', a: 'Yes. The ROI Audit evaluates current economics, member behavior, channel performance, and costs, then ranks improvements by impact, confidence, effort, and time to value.' },
      { q: 'Will finance trust the result?', a: 'The methodology credits only incremental behavior, includes full costs, and shows assumptions and confidence. It is built to withstand CFO scrutiny.' },
    ],
  },
  {
    title: 'Pricing & engagement',
    items: [
      { q: 'How much does it cost?', a: 'Engagements are scoped to what you need. Talk with us about the right scope and we will recommend a starting point—no invented list price.' },
      { q: 'How do we start?', a: 'Most teams start with the public Loyalty Opportunity Estimator, then move to a detailed scenario report, an account-list scoring, or an ROI audit.' },
    ],
  },
]

// A short set reused on the homepage.
export const HOME_FAQS = [
  FAQ_CATEGORIES[1].items[0],
  FAQ_CATEGORIES[1].items[2],
  FAQ_CATEGORIES[1].items[3],
  FAQ_CATEGORIES[2].items[0],
  FAQ_CATEGORIES[0].items[2],
]
