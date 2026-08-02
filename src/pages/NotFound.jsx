import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'
import { Container, Band, Eyebrow, Btn, Arrow } from '../components/ui.jsx'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you are looking for could not be found." />
      <Band tone="dark" className="min-h-[60vh] grid place-items-center">
        <Container>
          <div className="text-center max-w-[560px] mx-auto">
            <Eyebrow>404</Eyebrow>
            <h1 className="text-[clamp(34px,6vw,56px)] font-semibold mt-2">This page isn’t here.</h1>
            <p className="text-ondarkmuted text-lg mt-4">The link may be old or mistyped. Here are some useful places to go instead.</p>
            <div className="flex gap-3 justify-center flex-wrap mt-8">
              <Btn to="/" variant="primary">Go home <Arrow /></Btn>
              <Btn to="/estimator" variant="outline-dark">Estimate Loyalty ROI</Btn>
            </div>
            <div className="flex gap-4 justify-center flex-wrap mt-8 text-sm text-ondarkmuted">
              <Link to="/methodology" className="hover:text-orange">Methodology</Link>
              <Link to="/calculators" className="hover:text-orange">Calculators</Link>
              <Link to="/for-vendors" className="hover:text-orange">For Vendors</Link>
              <Link to="/for-brands" className="hover:text-orange">For Brands</Link>
              <Link to="/sitemap" className="hover:text-orange">Sitemap</Link>
            </div>
          </div>
        </Container>
      </Band>
    </>
  )
}
