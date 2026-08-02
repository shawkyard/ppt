import { Routes, Route, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import SolutionPage from './components/SolutionPage.jsx'

import Home from './pages/Home.jsx'
import Platform from './pages/Platform.jsx'
import WhyROI from './pages/WhyROI.jsx'
import Methodology from './pages/Methodology.jsx'
import DataConfidence from './pages/DataConfidence.jsx'
import CalculatorLibrary from './pages/CalculatorLibrary.jsx'
import EstimatorPage from './pages/EstimatorPage.jsx'
import ForVendors from './pages/ForVendors.jsx'
import ForBrands from './pages/ForBrands.jsx'
import ProgramMatcher from './pages/ProgramMatcher.jsx'
import Resources from './pages/Resources.jsx'
import Glossary from './pages/Glossary.jsx'
import FaqPage from './pages/FaqPage.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Security from './pages/Security.jsx'
import Sitemap from './pages/Sitemap.jsx'
import Legal from './pages/Legal.jsx'
import NotFound from './pages/NotFound.jsx'

// Renders the data-driven template using the last path segment as the slug.
function SolutionRoute() {
  const { slug } = useParams()
  return <SolutionPage slug={slug} />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Understand */}
        <Route path="/platform" element={<Platform />} />
        <Route path="/why-loyalty-roi" element={<WhyROI />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/data-confidence" element={<DataConfidence />} />

        {/* Calculators & estimator */}
        <Route path="/calculators" element={<CalculatorLibrary />} />
        <Route path="/estimator" element={<EstimatorPage />} />

        {/* Vendors */}
        <Route path="/for-vendors" element={<ForVendors />} />
        <Route path="/for-vendors/:slug" element={<SolutionRoute />} />

        {/* Brands */}
        <Route path="/for-brands" element={<ForBrands />} />
        <Route path="/for-brands/:slug" element={<SolutionRoute />} />
        <Route path="/program-matcher" element={<ProgramMatcher />} />

        {/* Solutions & channels */}
        <Route path="/solutions/:slug" element={<SolutionRoute />} />
        <Route path="/channels/:slug" element={<SolutionRoute />} />

        {/* Resources & company */}
        <Route path="/resources" element={<Resources />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/security" element={<Security />} />
        <Route path="/sitemap" element={<Sitemap />} />

        {/* Legal */}
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
        <Route path="/accessibility" element={<Legal kind="accessibility" />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
