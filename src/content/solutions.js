// Data-driven content for templated solution, product, outcome, and channel pages.
// Each entry is rendered by components/SolutionPage.jsx.

const CTA_ESTIMATE = { label: 'Estimate Loyalty ROI', to: '/estimator' }
const CTA_CALL = { label: 'Book a Strategy Call', to: '/contact' }

export const SOLUTIONS = {
  // ---------------- VENDOR PRODUCTS ----------------
  'pre-scope': {
    seo: { title: 'Pre-Scope Intelligence', description: 'Rank the accounts most likely to have a credible loyalty business case, with evidence, confidence, and a recommended next action.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'Pre-Scope Intelligence' }],
    h1: 'Know which accounts deserve your sales team’s time.',
    highlight: 'deserve your sales team’s time',
    sub: 'Upload or connect a company list, and Alma ranks the accounts most likely to have a credible loyalty business case—so you spend effort where the economics already point.',
    intro: [
      'Salespeople lose weeks chasing companies that were never going to build a program that pays back. Pre-Scope Intelligence evaluates each account for economic fit before anyone picks up the phone.',
      'Every score is explainable. You see why an account ranked where it did, the evidence behind it, and how confident the read is—so a high score is a reason to investigate, not a promise of a purchase.',
    ],
    cards: [
      { icon: '⇪', h: 'Ingest', p: 'Bring a CRM export, an account universe, or a TAM file. No manual re-keying.' },
      { icon: '◎', h: 'Enrich', p: 'Each account is enriched with relevant public and licensed data where permitted.' },
      { icon: '⚖', h: 'Score', p: 'Economic fit, channel fit, repeat-purchase potential, addressable membership, and margin conditions become an opportunity score with a confidence level.' },
      { icon: '➛', h: 'Act', p: 'Get the recommended ROI model, discovery questions, stakeholders, and outreach angle for each account.' },
    ],
    steps: [
      { h: 'Ingest the list', p: 'Upload company records or connect your CRM.' },
      { h: 'Enrich each account', p: 'Add public and licensed signals where permitted by license and policy.' },
      { h: 'Evaluate fit', p: 'Score economic fit, channel profile, repeat potential, addressable membership, margin, and evidence quality.' },
      { h: 'Prioritize', p: 'Surface the most promising segment—such as the top 25%—instead of treating every account as equal.' },
      { h: 'Explain & recommend', p: 'For each account: why it ranked there, the best calculator, discovery questions, and a next action.' },
    ],
    bullets: {
      title: 'What you get for each account',
      items: [
        'Ranked target accounts with an ICP-fit score and an ROI-potential score',
        'Evidence and source links, plus a confidence level',
        'An estimated opportunity range and likely value drivers',
        'Likely objections and risks, and a recommended outreach angle',
        'A recommended calculator or report and a sales-ready account brief',
        'CRM-ready fields and next steps',
      ],
    },
    illustrative: 'Account scores shown in the product are synthetic and labeled as demonstrations. Processing limits are not published until technically confirmed.',
    faqs: [
      { q: 'Does a high score mean the account will buy?', a: 'No. A high score means the economics and evidence justify investigating the account. It is a prioritization signal, not a guarantee of a purchase or a program outcome.' },
      { q: 'How large a list can Alma handle?', a: 'The platform is built to work with large lists. We describe capacity in technically accurate terms and confirm limits for your data before you rely on them, rather than publishing a headline number.' },
      { q: 'Is human review involved?', a: 'Yes. Scores are meant to focus human judgment, not replace it. Every ranking is explainable so your team can sanity-check and override it.' },
    ],
    cta: { title: 'Upload a sample list and see the ranking.', highlight: 'see the ranking', sub: 'Bring a slice of your pipeline and we will show you how prioritization would change your week.', primary: { label: 'Upload a Sample List', to: '/contact' }, secondary: CTA_CALL },
  },

  'account-prioritization': {
    seo: { title: 'Account Prioritization & ABM', description: 'Turn a large TAM into a focused, evidence-backed pursuit list ranked by likely loyalty economic fit.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'Account Prioritization' }],
    h1: 'Turn a large TAM into a focused, evidence-backed pursuit list.',
    highlight: 'evidence-backed pursuit list',
    sub: 'A total addressable market is a starting point, not a plan. Alma ranks it by the factors that actually predict a workable loyalty business case.',
    intro: [
      'Most account lists are sorted by size or industry, not by whether a loyalty program would pay back. Alma prioritizes on economic fit so your ABM effort lands where it can convert.',
      'A high priority score is a reason to investigate—never an automatic endorsement to pursue at any cost.',
    ],
    cards: [
      { icon: '⚖', h: 'Economic fit', p: 'Margin, repeat-purchase potential, and addressable membership drive most of the signal.' },
      { icon: '⧉', h: 'Operational fit', p: 'Channel profile, program feasibility, and data availability shape how quickly value can be proven.' },
      { icon: '⏱', h: 'Timing signals', p: 'Where permitted, timing and intent signals refine when to engage.' },
      { icon: '◱', h: 'Evidence quality', p: 'Weak evidence lowers confidence—so you never over-commit to a thin read.' },
    ],
    steps: [
      { h: 'Define ICP & TAM', p: 'Set the profile that fits your platform and services.' },
      { h: 'Score the universe', p: 'Rank accounts by economic and operational fit with a confidence level.' },
      { h: 'Segment the pursuit', p: 'Focus on the segment where the case is strongest.' },
      { h: 'Plan outreach', p: 'Attach the recommended model, stakeholders, and message to each tier.' },
    ],
    bullets: {
      title: 'Outputs',
      items: [
        'A tiered pursuit list with rationale per account',
        'ICP-fit and ROI-potential scores with confidence',
        'Recommended calculator and discovery questions',
        'Suggested stakeholders and outreach angle',
        'CRM-ready fields for handoff',
      ],
    },
    faqs: [
      { q: 'How is this different from generic intent data?', a: 'Intent data tells you who is looking. Alma tells you where a loyalty program is likely to pay back, based on the target’s own economics—then pairs that with the right ROI model and message.' },
      { q: 'Can we keep our existing ICP?', a: 'Yes. Alma scores against the ICP and TAM you define, and shows why accounts rank where they do so you can refine the profile over time.' },
    ],
    cta: { title: 'Build a priority account plan from your TAM.', highlight: 'priority account plan', sub: 'We will rank a sample of your market and show the reasoning behind each tier.', primary: { label: 'Build My Priority Account Plan', to: '/contact' }, secondary: CTA_CALL },
  },

  'sales-toolkit': {
    seo: { title: 'Vendor Sales Toolkit', description: 'From target account to ROI-centered proposal: research, discovery, calculators, stakeholder stories, and follow-up grounded in account evidence.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'Vendor Sales Toolkit' }],
    h1: 'From target account to ROI-centered proposal.',
    highlight: 'ROI-centered proposal',
    sub: 'A connected system for people who sell loyalty. It begins with account intelligence and ends with a proposal a CFO can follow—every step grounded in evidence and a relevant ROI model.',
    intro: [
      'This is not generic AI copywriting. The value is that the message, report, and proposal are anchored to the account’s economics and a specific loyalty ROI model—so the numbers hold up in the room.',
      'Each stakeholder hears the version that matters to them: finance sees payback and margin, marketing sees active-member growth, IT sees integration reality.',
    ],
    cards: [
      { icon: '◱', h: 'Research & discovery', p: 'Account brief, discovery prep, and the questions that surface real inputs.' },
      { icon: '◫', h: 'Model selection', p: 'The right calculator for the prospect’s business model and channel.' },
      { icon: '❝', h: 'Financial storytelling', p: 'Stakeholder-specific messages for finance, marketing, loyalty, IT, and procurement.' },
      { icon: '⎙', h: 'Proposal & follow-up', p: 'ROI-centered proposal content, objection handling, and meeting follow-up.' },
    ],
    steps: [
      { h: 'Research', p: 'Evidence-backed account brief.' },
      { h: 'Discovery', p: 'Structured questions that produce usable inputs.' },
      { h: 'Model', p: 'Prospect-specific ROI ranges from the right calculator.' },
      { h: 'Story', p: 'Stakeholder messages and executive summary.' },
      { h: 'Propose', p: 'ROI-centered proposal and proof assets.' },
      { h: 'Follow up', p: 'CRM connection, opportunity-stage guidance, and handoff to customer success.' },
    ],
    bullets: {
      title: 'Included across the workflow',
      items: [
        'ICP/TAM definition, ABM selection, and account prioritization',
        'Prospect research briefs and discovery preparation',
        'Prospect-specific ROI ranges and financial storytelling',
        'Email, LinkedIn, SMS, and follow-up messaging grounded in the model',
        'Proposal content, proof-asset selection, and CRM connection by API',
        'Closed-won handoff and original-business-case tracking after launch',
      ],
    },
    faqs: [
      { q: 'Is this just an AI writing tool?', a: 'No. The messaging and proposals are grounded in account evidence and a specific ROI model. The point is defensibility, not volume of copy.' },
      { q: 'Does it fit our existing sales process?', a: 'Yes. It layers ROI intelligence onto your stages and CRM rather than replacing your motion.' },
    ],
    cta: { title: 'See the sales workflow end to end.', highlight: 'sales workflow', sub: 'From account brief to proposal, walk the motion with your own example.', primary: { label: 'See the Sales Workflow', to: '/contact' }, secondary: CTA_CALL },
  },

  'white-label': {
    seo: { title: 'White-Label ROI Calculators', description: 'Your brand, your prospects, a stronger ROI conversation. Hosted, embedded, private, or API-powered calculators that keep your identity and sales process.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'White-Label Calculators' }],
    h1: 'Your brand. Your prospects. A stronger ROI conversation.',
    highlight: 'A stronger ROI conversation',
    sub: 'Place Alma-powered ROI tools on your own site or use them privately with prospects. You keep your brand and sales process; Alma supplies the economic methodology and decision layer.',
    intro: [
      'Generic calculators are too shallow to be credible. White-label experiences give your prospects a real, conservative estimate—under your name—with the assumptions and confidence shown.',
      'Create multiple models by vertical, channel, and business type, each with configurable assumptions and disclaimers.',
    ],
    cards: [
      { icon: '◫', h: 'Hosted or embedded', p: 'A fully vendor-branded calculator on your site, a branded microsite, or an embedded widget.' },
      { icon: '🔒', h: 'Public or gated', p: 'A public educational tool or a gated detailed assessment that captures qualified leads.' },
      { icon: '⚙', h: 'API-powered', p: 'Drive your own experience through the API, with configurable assumptions per model.' },
      { icon: '⎙', h: 'Report & handoff', p: 'Downloadable vendor-branded reports and CRM / marketing-automation handoff.' },
    ],
    bullets: {
      title: 'Configuration & governance',
      items: [
        'Brand controls: logo, colors, disclaimers, and default assumptions',
        'Public, gated, and sales-only modes',
        'Lead flow and data capture that fit your funnel',
        'Multiple models by business model and channel',
        'Versioned assumptions so results stay consistent and auditable',
      ],
    },
    faqs: [
      { q: 'Do prospects see Alma’s brand?', a: 'Only if you want them to. The experience carries your brand; Alma is the methodology underneath.' },
      { q: 'Can we run different models for different verticals?', a: 'Yes. You can publish several calculators, each tuned to a business model or channel, with its own assumptions and disclaimers.' },
    ],
    cta: { title: 'Design a white-label calculator for your funnel.', highlight: 'white-label calculator', sub: 'Tell us your verticals and we will scope the models that fit.', primary: { label: 'Design My White-Label Calculator', to: '/contact' }, secondary: CTA_CALL },
  },

  'roi-reports': {
    seo: { title: 'Vendor ROI Reports & Proposals', description: 'Make the business case part of the proposal—not an afterthought. Executive summaries, scenarios, break-even, and confidence with full traceability.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'ROI Reports & Proposals' }],
    h1: 'Make the business case part of the proposal—not an afterthought.',
    highlight: 'part of the proposal',
    sub: 'Turn a model into an executive-ready report and an ROI-centered proposal, with every statement traceable back to an input.',
    intro: [
      'Proposals that only describe features leave the buyer to do the math—badly, or not at all. Alma reports lead with the financial case and show the assumptions behind it.',
      'Traceability is the point: a reviewer can follow any headline number to the input and assumption that produced it.',
    ],
    cards: [
      { icon: '❑', h: 'Executive summary', p: 'The decision, the range, and what must be true—up front.' },
      { icon: '▤', h: 'Scenarios & drivers', p: 'Conservative, expected, and upside, with the value drivers that move them.' },
      { icon: '⚑', h: 'Costs & break-even', p: 'Full program cost, break-even thresholds, and sensitivity.' },
      { icon: '✎', h: 'Branding', p: 'Report and proposal output in your brand, ready to send.' },
    ],
    bullets: {
      title: 'Every report includes',
      items: [
        'Executive summary and current-state economics',
        'Conservative, expected, and upside scenarios',
        'Cost assumptions, break-even thresholds, and sensitivity',
        'Confidence level and stated exclusions',
        'Stakeholder-specific framing and likely objections',
        'Input-to-statement traceability',
      ],
    },
    faqs: [
      { q: 'Can we brand the report?', a: 'Yes. Reports and proposals are produced in your brand, ready for the prospect.' },
      { q: 'How do you avoid false precision?', a: 'Results are shown as ranges with rounded figures and a confidence label. We never present a single exact number the inputs cannot support.' },
    ],
    cta: { title: 'View a sample ROI report.', highlight: 'sample ROI report', sub: 'See how the business case reads when it leads the proposal.', primary: { label: 'View a Sample Report', to: '/contact' }, secondary: CTA_CALL },
  },

  'portfolio': {
    seo: { title: 'Portfolio Intelligence', description: 'See which loyalty programs are healthy, which need help, and why—comparing the original business case with actual performance.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'Portfolio Intelligence' }],
    h1: 'See which programs are healthy, which need help, and why.',
    highlight: 'which need help, and why',
    sub: 'For vendors, consultants, and multi-brand operators: organize a portfolio view of loyalty programs and surface the changes that deserve attention—before renewal risk is high.',
    intro: [
      'Too often a struggling program only becomes visible at renewal. Portfolio Intelligence compares the original business case with current actuals so problems surface while there is still time to act.',
      'It points to the behavior, cost, or data change behind a result—not just that a number moved.',
    ],
    cards: [
      { icon: '▤', h: 'Program health', p: 'A health view across programs with the drivers behind each score.' },
      { icon: '⇄', h: 'Case vs. actuals', p: 'Original business case against current member, frequency, AOV, retention, and margin.' },
      { icon: '⚠', h: 'Risk & data alerts', p: 'Renewal and churn risk, cost variance, and data-quality alerts.' },
      { icon: '➛', h: 'Next best action', p: 'Suggested investigation and the highest-value next step per program.' },
    ],
    bullets: {
      title: 'What it surfaces',
      items: [
        'Member growth and active-member changes',
        'Purchase-frequency and AOV changes',
        'Retention, margin, and program-cost variance',
        'Reward-cost and liability changes',
        'Renewal / churn risk and expansion opportunity',
        'Data-quality alerts and recommended investigation',
      ],
    },
    illustrative: 'Any figure of programs monitored is described in technically accurate language and confirmed before you rely on it—no unverified scale claims.',
    faqs: [
      { q: 'How many programs can you monitor?', a: 'We present scale in accurate terms and confirm capacity for your portfolio, rather than publishing a headline number that may not hold in production.' },
      { q: 'Does this replace our analytics?', a: 'No. It focuses attention—linking changes back to the original business case and to a recommended action—so your team knows where to look first.' },
    ],
    cta: { title: 'Discuss portfolio monitoring for your book.', highlight: 'portfolio monitoring', sub: 'Bring a handful of programs and we will show the health view and the signals.', primary: { label: 'Discuss Portfolio Monitoring', to: '/contact' }, secondary: CTA_CALL },
  },

  'integrations': {
    seo: { title: 'CRM & Proposal Integrations', description: 'Bring loyalty ROI into the systems your revenue team already uses—via API or approved integration, with permissions and an audit trail.' },
    audience: 'For loyalty vendors',
    breadcrumb: [{ label: 'For Vendors', to: '/for-vendors' }, { label: 'CRM & Proposal Integrations' }],
    h1: 'Bring loyalty ROI into the systems your revenue team already uses.',
    highlight: 'systems your revenue team already uses',
    sub: 'Connect Alma to your CRM and proposal tools so ROI intelligence flows into the workflow—not into a separate tab nobody opens.',
    intro: [
      'ROI that lives outside the CRM gets ignored. Alma can connect through API or an approved integration to write scores, ranges, and next steps where reps already work.',
      'We do not claim named integrations we do not have. Where a specific connector is not yet available, Alma connects through the API.',
    ],
    cards: [
      { icon: '⚙', h: 'API & data mapping', p: 'Map Alma outputs to your fields and objects.' },
      { icon: '▦', h: 'CRM fields & triggers', p: 'Write scores and stages; trigger actions on changes.' },
      { icon: '⎙', h: 'Proposal outputs', p: 'Feed ROI content into your proposal software.' },
      { icon: '🔒', h: 'Permissions & audit', p: 'Least-privilege access and an audit trail for sensitive data.' },
    ],
    faqs: [
      { q: 'Which CRMs do you integrate with?', a: 'Alma connects through API or approved integrations. We confirm the specific connectors available for your stack rather than listing names we cannot yet support.' },
      { q: 'How is sensitive data handled?', a: 'Confidential inputs are handled server-side with least-privilege access and isolation. Uploaded lists, assumptions, and reports are never exposed in client-side code or public storage.' },
    ],
    cta: { title: 'Plan an integration with your stack.', highlight: 'Plan an integration', sub: 'Tell us your CRM and proposal tools and we will map the connection.', primary: { label: 'Plan an Integration', to: '/contact' }, secondary: CTA_CALL },
  },

  // ---------------- BRAND OUTCOMES ----------------
  'business-case': {
    seo: { title: 'Build the Business Case', description: 'Turn a loyalty idea into an executive-ready financial case: baseline, scenarios, break-even, costs, confidence, and a measurement plan.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Build the Business Case' }],
    h1: 'Turn a loyalty idea into an executive-ready financial case.',
    highlight: 'executive-ready financial case',
    sub: 'Give finance a conservative, transparent case they can approve—and marketing a plan they can execute against.',
    intro: [
      'Budgets move when marketing and finance share one set of definitions and one honest range. Alma builds the case on your baseline, your costs, and clearly labeled assumptions.',
      'You leave with the scenarios, the break-even conditions, and the measurement plan to prove the case after launch.',
    ],
    cards: [
      { icon: '▦', h: 'Baseline', p: 'Current customers, frequency, order value, and margin—before crediting loyalty.' },
      { icon: '▤', h: 'Scenarios', p: 'Conservative, expected, and upside, with the drivers behind each.' },
      { icon: '⚑', h: 'Break-even', p: 'The active membership and behavior lift required to pay back.' },
      { icon: '◷', h: 'Measurement plan', p: 'How you will prove the case with cohorts, controls, and actuals.' },
    ],
    bullets: {
      title: 'The case covers',
      items: [
        'Current baseline economics and behavior opportunities',
        'Full program costs and reward funding',
        'Conservative / expected / upside scenarios and break-even',
        'Risks, confidence level, and implementation choices',
        'A measurement plan and an executive-ready report',
      ],
    },
    faqs: [
      { q: 'Will finance trust the numbers?', a: 'The case is built on your baseline and full costs, credits only incremental behavior, and shows assumptions and confidence. It is designed to survive CFO scrutiny.' },
      { q: 'What if we do not have all the data?', a: 'Missing inputs use labeled benchmark assumptions, and the confidence level reflects that. As you add real data, the case gets stronger.' },
    ],
    cta: { title: 'Start your loyalty business case.', highlight: 'business case', sub: 'Begin with the estimator, then build the executive-ready version with our team.', primary: { label: 'Start My Business Case', to: '/estimator' }, secondary: CTA_CALL },
  },

  'active-membership': {
    seo: { title: 'Increase Active Membership', description: 'Enrollment is the beginning; active participation creates the opportunity. Model the value of activating members, not just signing them up.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Increase Active Membership' }],
    h1: 'Enrollment is the beginning. Active participation creates the opportunity.',
    highlight: 'Active participation',
    sub: 'A big membership count means little if few members participate. Alma helps you value and grow active members—the ones who actually move the economics.',
    intro: [
      'It is easy to buy enrollments and call it success. The money is in activation: members who reach a first-value moment and keep engaging.',
      'We separate recruitable members from enrolled members from active members, so you invest where unit economics improve.',
    ],
    cards: [
      { icon: '◎', h: 'Recruitable base', p: 'Who can realistically be recruited, by channel.' },
      { icon: '✦', h: 'First-value moment', p: 'The earliest point a member sees a reason to stay active.' },
      { icon: '↻', h: 'Repeat engagement', p: 'The cadence that sustains participation without fatigue.' },
      { icon: '$', h: 'Unit economics', p: 'The value of an active member after reward and service cost.' },
    ],
    bullets: {
      title: 'KPIs to watch',
      items: [
        'Enrollment rate and active-member rate (kept distinct)',
        'Time to first value and activation rate',
        'Repeat engagement and lapse rate',
        'Incremental value per active member after cost',
      ],
    },
    faqs: [
      { q: 'Why not just maximize enrollment?', a: 'Empty enrollment adds cost and noise without profit. The goal is active members whose incremental value exceeds the cost to activate and serve them.' },
    ],
    cta: { title: 'Estimate the value of active members.', highlight: 'value of active members', sub: 'See how activation, not enrollment, changes the ROI.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'purchase-frequency': {
    seo: { title: 'Increase Purchase Frequency', description: 'Measure whether loyalty creates more valuable visits—not just more messages—using baselines, incrementality, and control methods.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Increase Purchase Frequency' }],
    h1: 'Measure whether loyalty creates more valuable visits—not just more messages.',
    highlight: 'more valuable visits',
    sub: 'Frequency is a powerful lever, but only the incremental part counts. Alma isolates the visits loyalty actually caused and prices them after reward cost and margin.',
    intro: [
      'Sending more offers can lift measured frequency while destroying margin. The real question is how many additional, profitable visits the program caused.',
      'We use baselines and control methods so a busy calendar is not mistaken for incremental behavior.',
    ],
    cards: [
      { icon: '▦', h: 'Baseline frequency', p: 'What visits would have happened anyway.' },
      { icon: '⚗', h: 'Incrementality', p: 'The additional visits attributable to the program.' },
      { icon: '◴', h: 'Cadence & fatigue', p: 'How often you can prompt before returns fall.' },
      { icon: '$', h: 'Reward cost & margin', p: 'The cost of each extra visit against its margin.' },
    ],
    bullets: {
      title: 'What the model considers',
      items: [
        'Baseline frequency and eligible categories',
        'Seasonality and control-group comparisons',
        'Reward cost per incremental visit',
        'Message fatigue and diminishing returns',
      ],
    },
    faqs: [
      { q: 'How do you avoid crediting visits we would have gotten anyway?', a: 'By establishing a baseline and comparing against controls or matched cohorts, then crediting only the incremental, profitable visits.' },
    ],
    cta: { title: 'Model frequency lift for your business.', highlight: 'frequency lift', sub: 'See how incremental visits translate to profit after cost.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'average-order-value': {
    seo: { title: 'Increase Average Order Value', description: 'Grow the basket without giving away the margin—model incremental basket value, threshold rewards, and discount leakage.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Increase Average Order Value' }],
    h1: 'Grow the basket without giving away the margin.',
    highlight: 'without giving away the margin',
    sub: 'Bigger baskets only help if the added value outruns the incentive. Alma models incremental AOV against discount leakage and margin.',
    intro: [
      'Threshold rewards and bundles can lift AOV—or simply subsidize purchases customers would have made. The difference is margin.',
      'We separate genuine incremental basket value from mix shift and leakage so the lift is real.',
    ],
    cards: [
      { icon: '↑', h: 'Incremental basket', p: 'The added value the program actually caused.' },
      { icon: '⇢', h: 'Mix shift', p: 'Whether higher AOV reflects better mix or just discounting.' },
      { icon: '⚑', h: 'Threshold rewards', p: 'Where spend thresholds help without eroding margin.' },
      { icon: '$', h: 'Discount leakage', p: 'Incentive value captured by customers who would have bought anyway.' },
    ],
    bullets: {
      title: 'What the model considers',
      items: [
        'Incremental basket value vs. mix shift',
        'Threshold rewards, bundles, and cross-sell',
        'Premium benefits and their cost',
        'Discount leakage and net margin impact',
      ],
    },
    faqs: [
      { q: 'Does a higher AOV always help?', a: 'No. If the incentive to grow the basket costs more than the added margin, AOV can rise while profit falls. The model checks for that.' },
    ],
    cta: { title: 'Model AOV lift after margin.', highlight: 'AOV lift', sub: 'See whether a bigger basket actually adds profit.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'retention': {
    seo: { title: 'Improve Retention & Lifetime Value', description: 'Keep the customers whose future value exceeds the cost to retain them—model retention economics, save costs, and CLV.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Improve Retention & CLV' }],
    h1: 'Keep the customers whose future value exceeds the cost to retain them.',
    highlight: 'future value exceeds the cost',
    sub: 'Retention is only profitable when the value you keep outruns the incentive you spend. Alma models retention economics and lifetime value, not just churn rate.',
    intro: [
      'Blanket save offers often pay people who would have stayed anyway. The goal is to retain the customers whose future value justifies the cost.',
      'We weigh churn risk, cohort timing, and save costs against customer lifetime value—after program expense.',
    ],
    cards: [
      { icon: '♥', h: 'Retention economics', p: 'The value of a retained customer after incentive and service cost.' },
      { icon: '⚠', h: 'Churn risk', p: 'Who is genuinely at risk vs. who would have stayed.' },
      { icon: '◷', h: 'Cohort timing', p: 'When intervention changes the outcome.' },
      { icon: '∞', h: 'Lifetime value', p: 'Future value net of the cost to retain it.' },
    ],
    bullets: {
      title: 'What the model considers',
      items: [
        'Churn risk and cohort timing',
        'Save costs and offer costs',
        'Customer lifetime value after program cost',
        'Over-incentivizing customers who would have stayed anyway',
      ],
    },
    faqs: [
      { q: 'How do you avoid paying loyal customers to stay?', a: 'By targeting genuine churn risk and comparing outcomes against a baseline, so incentives go to relationships that would otherwise lapse.' },
    ],
    cta: { title: 'Estimate profitable retention value.', highlight: 'profitable retention value', sub: 'See which relationships are worth retaining after cost.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'audience-strategy': {
    seo: { title: 'Audience Strategy & Membership Growth', description: 'Give each customer a reason to join—and a reason to stay active—with an audience framework tied to signup, activation, and lifetime value.' },
    audience: 'For brands',
    breadcrumb: [{ label: 'For Brands', to: '/for-brands' }, { label: 'Audience Strategy' }],
    h1: 'Give each customer a reason to join—and a reason to stay active.',
    highlight: 'a reason to stay active',
    sub: 'More traffic is not the goal. More qualified enrollment and more valuable participation is. Alma builds audience strategy that connects to real member economics.',
    intro: [
      'Every audience joins for a different reason and stalls for a different reason. A single generic pitch under-converts all of them.',
      'For each audience we define the question, the motivation, the benefit that matters, the objection, the proof needed, and the KPI it moves.',
    ],
    cards: [
      { icon: '?', h: 'Question & motivation', p: 'What the audience is really asking, and why they would join.' },
      { icon: '★', h: 'Benefit that matters', p: 'The single benefit most likely to convert this audience.' },
      { icon: '⚑', h: 'Objection & proof', p: 'What holds them back and what reassurance resolves it.' },
      { icon: '➛', h: 'Action & onboarding', p: 'The desired action and the path to first value.' },
    ],
    bullets: {
      title: 'The audience framework',
      items: [
        'Who the audience is and their primary question',
        'Problem/motivation and the benefit that matters most',
        'Objections to joining and proof needed',
        'Desired action, the KPI affected, and the onboarding path',
      ],
    },
    illustrative: 'Sample audiences are shown as clearly labeled hypothetical examples, not client results.',
    faqs: [
      { q: 'Is this just SEO content?', a: 'Public pages are built where the content is genuinely useful and unique. Personalized or account-specific analysis is gated. The aim is qualified enrollment, not raw traffic.' },
    ],
    cta: { title: 'Map your loyalty audiences.', highlight: 'loyalty audiences', sub: 'Define the audiences that matter and the reason each will join and stay.', primary: { label: 'Map My Loyalty Audiences', to: '/contact' }, secondary: CTA_CALL },
  },

  // ---------------- SOLUTIONS ----------------
  'roi-audit': {
    seo: { title: 'ROI Audit & Business Case', description: 'Find out where your loyalty program is creating value—and where it is leaking it. An expert-led or platform-assisted audit with an executive-ready report.' },
    audience: 'Solutions',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'ROI Audit' }],
    h1: 'Find out where your loyalty program is creating value—and where it is leaking it.',
    highlight: 'where it is leaking it',
    sub: 'An expert-led or platform-assisted review of a live program: current economics, member behavior, channel performance, costs, gaps, and the opportunities ranked by impact.',
    intro: [
      'Most programs have both value creation and value leakage happening at once. The audit separates them and ranks what to fix first.',
      'You get an executive-ready report and clear next-step options—without being forced into a software purchase.',
    ],
    cards: [
      { icon: '❑', h: 'Current-state economics', p: 'What the program earns today, incremental of baseline.' },
      { icon: '◱', h: 'Data & confidence', p: 'A data-quality assessment and an honest confidence read.' },
      { icon: '▤', h: 'Scenarios & break-even', p: 'Conservative/expected/upside and the conditions to pay back.' },
      { icon: '➛', h: 'Ranked recommendations', p: 'Actions ranked by impact, confidence, effort, and time to value.' },
    ],
    bullets: {
      title: 'What you receive',
      items: [
        'Executive summary and current-state economics',
        'Data-quality and confidence assessment',
        'Conservative, expected, and upside scenarios with break-even',
        'Key value drivers, risks, and highest-value audiences and channels',
        'Recommendations ranked by impact, confidence, effort, and time to value',
        'A measurement plan and presentation-ready charts',
      ],
    },
    faqs: [
      { q: 'Who is it for?', a: 'Brands with a live program that want independent measurement or improvement, and vendor prospects who want a defensible read before committing.' },
      { q: 'What if our data is incomplete?', a: 'The audit works with what is available, labels assumptions, and states confidence—then tells you which data would most improve the answer.' },
      { q: 'Do we have to buy software?', a: 'No. The audit ends with clear next-step options, not a forced purchase.' },
    ],
    cta: { title: 'Request an ROI audit of your program.', highlight: 'ROI audit', sub: 'Bring your current program and we will show where value is created and leaked.', primary: { label: 'Request an ROI Audit', to: '/contact' }, secondary: CTA_ESTIMATE },
  },

  'loyalty-games': {
    seo: { title: 'Loyalty Games & Points Engagement', description: 'Use points and prizes to create measurable engagement—not random noise. Responsible, brand-safe game mechanics with modeled economics.' },
    audience: 'Solutions',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Loyalty Games' }],
    h1: 'Use points and prizes to create measurable engagement—not random noise.',
    highlight: 'measurable engagement',
    sub: 'Branded, short-session engagement modules—spin-to-win, challenges, trivia, predictions, instant-win—designed for loyalty, with economics modeled before launch.',
    intro: [
      'Game mechanics can drive participation, but only when the prize budget and expected behavior are modeled first, and the experience stays brand-safe.',
      'This is loyalty engagement, not a gambling-parlor experience: transparent rules, eligibility controls, fraud prevention, and jurisdiction-aware legal review.',
    ],
    cards: [
      { icon: '◉', h: 'Experience types', p: 'Spin-the-wheel, challenges, trivia, predictions, and instant-win moments.' },
      { icon: '🔒', h: 'Brand-safe controls', p: 'Transparent rules, eligibility and age controls, and rate limits.' },
      { icon: '⚗', h: 'Modeled economics', p: 'Prize budget and expected participation modeled before launch.' },
      { icon: '⚖', h: 'Legal review', p: 'Jurisdiction-aware review and fraud prevention.' },
    ],
    bullets: {
      title: 'Responsible by design',
      items: [
        'Prize structure selected and funded per brand campaign',
        'Brand-relevant rewards wherever possible',
        'Fraud prevention and rate limits',
        'Economics connected to measurable member behavior',
      ],
    },
    illustrative: 'Prize amounts are selected and funded for each brand campaign; no prize value is promised as a general offer.',
    faqs: [
      { q: 'Isn’t this just gambling?', a: 'No. Games are designed for loyalty engagement with transparent rules, eligibility controls, and jurisdiction-aware legal review. Economics tie to real member behavior, not chance for its own sake.' },
      { q: 'How big are the prizes?', a: 'Prize structure is chosen and funded per campaign and modeled beforehand. We do not publish a headline prize value as a standing promise.' },
    ],
    cta: { title: 'Model a loyalty game before you launch it.', highlight: 'loyalty game', sub: 'We will model prize budget and expected participation against member behavior.', primary: { label: 'Model a Loyalty Game', to: '/contact' }, secondary: CTA_CALL },
  },

  'consulting': {
    seo: { title: 'Consulting, Custom Modeling & Implementation', description: 'Expert help where a standard model is not enough: custom ROI methodology, executive business cases, measurement plans, and implementation support.' },
    audience: 'Solutions',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Consulting' }],
    h1: 'Expert help where a standard model is not enough.',
    highlight: 'a standard model is not enough',
    sub: 'When a program, portfolio, or data situation needs a tailored approach, Alma’s team builds the methodology, the case, and the measurement plan with you.',
    intro: [
      'Some decisions need more than a self-serve calculator. Consulting brings the same conservative methodology to custom situations—complex channels, unusual economics, or portfolio-level design.',
      'The output is practical: something a salesperson, a loyalty leader, or a finance team can use immediately.',
    ],
    cards: [
      { icon: '⚗', h: 'Custom modeling', p: 'A tailored ROI methodology and executive business case.' },
      { icon: '◷', h: 'Measurement design', p: 'Program and portfolio measurement plans with cohorts and controls.' },
      { icon: '⚙', h: 'Configuration', p: 'Data mapping, model configuration, and white-label calculator creation.' },
      { icon: '❑', h: 'Enablement', p: 'Vendor sales enablement, proposal/CRM integration, and executive workshops.' },
    ],
    faqs: [
      { q: 'Do you only serve vendors?', a: 'No. We support brands, vendors, consultants, and multi-brand operators—wherever a custom ROI approach adds value.' },
    ],
    cta: { title: 'Talk about a custom engagement.', highlight: 'custom engagement', sub: 'Tell us the decision and we will scope the right support.', primary: CTA_CALL, secondary: CTA_ESTIMATE },
  },

  // ---------------- CHANNELS ----------------
  'ecommerce': {
    seo: { title: 'E-commerce Loyalty ROI', description: 'Why loyalty economics differ online, the inputs that matter, and the calculators that fit e-commerce programs.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'E-commerce Loyalty ROI' }],
    h1: 'E-commerce loyalty ROI, modeled for how you actually sell online.',
    highlight: 'how you actually sell online',
    sub: 'Rich behavioral data, high promo sensitivity, and thin-margin categories make e-commerce loyalty a margin question as much as a frequency question.',
    intro: [
      'Online, you can measure almost everything—which makes it easy to over-credit loyalty for revenue that discounting or retargeting would have produced anyway.',
      'The e-commerce model leans on your behavioral data to separate incremental purchases from baseline, and to weigh reward cost against category margin.',
    ],
    cards: [
      { icon: '⚗', h: 'Why it differs', p: 'Abundant data, high promo sensitivity, and variable category margins.' },
      { icon: '▦', h: 'Key inputs', p: 'Repeat rate, AOV, category margin, promo exposure, and return rate.' },
      { icon: '$', h: 'Costs & risks', p: 'Discount leakage, cannibalization of full-price sales, and reward liability.' },
      { icon: '◫', h: 'Recommended models', p: 'Incremental revenue, AOV lift, retention, and reward-cost models.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Repeat purchase rate and cohort retention',
        'Average order value and category-level margin',
        'Promotion exposure and discount usage',
        'Return/refund rate and shipping-cost treatment',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors selling to e-commerce brands use the model to show incremental margin—not just member GMV—so the case survives a finance review.' },
      { q: 'Brand use case', a: 'Brands use it to decide whether points, tiers, or paid membership fit their margin structure before committing budget.' },
    ],
    cta: { title: 'Estimate e-commerce loyalty ROI.', highlight: 'e-commerce loyalty ROI', sub: 'Start with the estimator, then refine with your behavioral data.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'retail': {
    seo: { title: 'Retail & Store Loyalty ROI', description: 'In-store loyalty economics: identification at the register, basket data, and the levers that move profitable frequency and AOV.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Retail & Store Loyalty ROI' }],
    h1: 'Retail loyalty ROI, grounded in real basket behavior.',
    highlight: 'real basket behavior',
    sub: 'In physical retail, the first challenge is identifying the member at the register; the second is proving the visits and baskets loyalty actually caused.',
    intro: [
      'Store programs live or die on identification rate—if members are not recognized at checkout, the data is too thin to measure. The model accounts for that first.',
      'From there it isolates incremental visits and basket lift, priced against reward cost and category margin.',
    ],
    cards: [
      { icon: '◪', h: 'Why it differs', p: 'Identification rate, basket-level data, and staff-driven enrollment.' },
      { icon: '▦', h: 'Key inputs', p: 'Visit frequency, basket size, margin mix, and member identification rate.' },
      { icon: '$', h: 'Costs & risks', p: 'Reward funding, markdown leakage, and unidentified member transactions.' },
      { icon: '◫', h: 'Recommended models', p: 'Frequency lift, AOV lift, and reward-cost models.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Member identification rate at point of sale',
        'Visit frequency and basket size by member vs. non-member',
        'Category margin mix and markdown exposure',
        'Enrollment method and staff incentives',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors show retail prospects the identification and margin conditions required for the program to pay back—before implementation.' },
      { q: 'Brand use case', a: 'Retailers decide where to invest: identification, benefit design, or activation, based on which lever moves profit most.' },
    ],
    cta: { title: 'Estimate retail loyalty ROI.', highlight: 'retail loyalty ROI', sub: 'Model profitable frequency and basket lift for your stores.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'omnichannel': {
    seo: { title: 'Omnichannel Loyalty ROI', description: 'When customers move across store, online, and app, loyalty ROI depends on attribution across channels—done conservatively.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Omnichannel Loyalty ROI' }],
    h1: 'Omnichannel loyalty ROI, without double-counting the win.',
    highlight: 'without double-counting the win',
    sub: 'When a member browses on an app, buys in store, and returns online, the risk is crediting the same behavior more than once. The omnichannel model guards against it.',
    intro: [
      'Cross-channel programs are powerful and easy to over-claim. A frequency lift, an AOV lift, and a retention lift can quietly count the same customer three times.',
      'The model reconciles behavior across channels first, then credits loyalty for the net incremental change.',
    ],
    cards: [
      { icon: '⇄', h: 'Why it differs', p: 'Cross-channel identity, attribution, and double-counting risk.' },
      { icon: '▦', h: 'Key inputs', p: 'Channel mix, cross-channel identification, and per-channel margin.' },
      { icon: '$', h: 'Costs & risks', p: 'Double-counting, channel cannibalization, and reward funding.' },
      { icon: '◫', h: 'Recommended models', p: 'Multi-channel incremental model with sensitivity analysis.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Channel mix and cross-channel identification rate',
        'Per-channel AOV, frequency, and margin',
        'Overlap between online and in-store behavior',
        'Attribution rules currently in use',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors demonstrate a defensible cross-channel case that a skeptical finance team will accept.' },
      { q: 'Brand use case', a: 'Brands see which channel combination creates the most incremental profit, not just the most member activity.' },
    ],
    cta: { title: 'Estimate omnichannel loyalty ROI.', highlight: 'omnichannel loyalty ROI', sub: 'Model net incremental value across your channels.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'restaurant': {
    seo: { title: 'Restaurant & Hospitality Loyalty ROI', description: 'High-frequency, thin-margin economics where visit cadence, check size, and reward cost decide whether loyalty pays back.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Restaurant & Hospitality Loyalty ROI' }],
    h1: 'Restaurant loyalty ROI, where every point of margin counts.',
    highlight: 'every point of margin counts',
    sub: 'High visit frequency and thin margins make restaurant loyalty unusually sensitive to reward cost. Small design choices swing the whole case.',
    intro: [
      'In hospitality, a generous reward can wipe out the margin on the very visits it creates. The model makes reward cost a first-class input, not an afterthought.',
      'It weighs incremental visit frequency and check size against food and labor margin and redemption cost.',
    ],
    cards: [
      { icon: '◔', h: 'Why it differs', p: 'High frequency, thin margins, and reward-cost sensitivity.' },
      { icon: '▦', h: 'Key inputs', p: 'Visit frequency, average check, food/labor margin, and redemption rate.' },
      { icon: '$', h: 'Costs & risks', p: 'Reward cost per visit, breakage, and staff execution.' },
      { icon: '◫', h: 'Recommended models', p: 'Frequency lift, reward-cost, and points liability models.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Visit frequency and average check by member vs. non-member',
        'Food and labor margin',
        'Reward structure and redemption/breakage rates',
        'Multi-location or franchise considerations',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors show operators the reward design that keeps the program profitable at their margins.' },
      { q: 'Brand use case', a: 'Operators test reward structures before rollout to avoid subsidizing existing traffic.' },
    ],
    cta: { title: 'Estimate restaurant loyalty ROI.', highlight: 'restaurant loyalty ROI', sub: 'Model visit frequency and check size against reward cost.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'subscription': {
    seo: { title: 'Subscription & Paid Loyalty ROI', description: 'Paid membership economics: fee revenue, breakage, and whether members spend enough more to justify the benefits.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'Subscription & Paid Loyalty ROI' }],
    h1: 'Subscription and paid loyalty ROI, benefit by benefit.',
    highlight: 'benefit by benefit',
    sub: 'Paid programs add fee revenue but also fixed benefit costs. The question is whether members spend and stay enough more to justify what they receive.',
    intro: [
      'A paid tier changes the math: you earn membership fees but commit to benefits that cost money whether or not a member uses them.',
      'The model weighs fee revenue and retention lift against benefit cost, breakage, and the risk of rewarding customers who would have paid full freight.',
    ],
    cards: [
      { icon: '◇', h: 'Why it differs', p: 'Fee revenue, fixed benefit cost, and self-selection of heavy users.' },
      { icon: '▦', h: 'Key inputs', p: 'Fee, take rate, benefit cost, incremental spend, and retention lift.' },
      { icon: '$', h: 'Costs & risks', p: 'Benefit cost, breakage, and adverse selection.' },
      { icon: '◫', h: 'Recommended models', p: 'Paid-loyalty economics and retention/CLV models.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Membership fee and expected take rate',
        'Cost of each benefit and expected usage',
        'Incremental spend and retention lift among members',
        'Breakage and adverse-selection assumptions',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors show whether a paid tier pays for its benefits at the prospect’s economics.' },
      { q: 'Brand use case', a: 'Brands set the fee and benefit mix so the program earns more than it gives away.' },
    ],
    cta: { title: 'Estimate paid loyalty ROI.', highlight: 'paid loyalty ROI', sub: 'Model fee revenue and retention against benefit cost.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },

  'b2b': {
    seo: { title: 'B2B, Partner & Channel Loyalty ROI', description: 'Longer cycles, fewer buyers, and higher order values change loyalty economics for B2B, partner, and channel programs.' },
    audience: 'By channel',
    breadcrumb: [{ label: 'Solutions', to: '/calculators' }, { label: 'B2B, Partner & Channel Loyalty ROI' }],
    h1: 'B2B and channel loyalty ROI, sized for fewer, bigger relationships.',
    highlight: 'fewer, bigger relationships',
    sub: 'With long cycles, few buyers, and large orders, a single account swings the result. B2B loyalty is about mix, retention, and share of wallet—not points-per-visit.',
    intro: [
      'B2B and channel programs reward behavior like reorder rate, category expansion, and partner-led revenue. The economics look nothing like consumer punch cards.',
      'The model focuses on retention of high-value accounts, share-of-wallet growth, and the cost of partner incentives.',
    ],
    cards: [
      { icon: '⌂', h: 'Why it differs', p: 'Long cycles, few buyers, high order values, and partner incentives.' },
      { icon: '▦', h: 'Key inputs', p: 'Reorder rate, share of wallet, account margin, and incentive cost.' },
      { icon: '$', h: 'Costs & risks', p: 'Incentive funding, concentration risk, and margin erosion on large deals.' },
      { icon: '◫', h: 'Recommended models', p: 'Retention/CLV, cross-sell, and partner-funded reward models.' },
    ],
    bullets: {
      title: 'What to bring',
      items: [
        'Reorder rate and share of wallet by account',
        'Account-level margin and concentration',
        'Partner incentive structure and cost',
        'Cross-sell and category-expansion potential',
      ],
    },
    faqs: [
      { q: 'Vendor use case', a: 'Vendors build a case around retaining and expanding a handful of high-value accounts, where the numbers are largest.' },
      { q: 'Brand use case', a: 'Manufacturers and distributors decide where partner incentives create real share-of-wallet growth vs. margin giveaway.' },
    ],
    cta: { title: 'Estimate B2B loyalty ROI.', highlight: 'B2B loyalty ROI', sub: 'Model retention and share-of-wallet against incentive cost.', primary: CTA_ESTIMATE, secondary: CTA_CALL },
  },
}

export const SOLUTION_SLUGS = Object.keys(SOLUTIONS)
