import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MarketGate from './pages/MarketGate.jsx'
import AddProperty from './pages/AddProperty.jsx'
import ScratchScreen from './pages/ScratchScreen.jsx'
import DealDetail from './pages/DealDetail.jsx'
import StabilizationPlan from './pages/StabilizationPlan.jsx'
import OfferPrice from './pages/OfferPrice.jsx'
import RiskRegister from './pages/RiskRegister.jsx'
import BrokerQuestions from './pages/BrokerQuestions.jsx'
import InvestorSummary from './pages/InvestorSummary.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<MarketGate />} />
        <Route path="/scratch" element={<ScratchScreen />} />
        <Route path="/add" element={<AddProperty />} />
        <Route path="/deal/:id" element={<DealDetail />} />
        <Route path="/deal/:id/plan" element={<StabilizationPlan />} />
        <Route path="/deal/:id/offer" element={<OfferPrice />} />
        <Route path="/deal/:id/risk" element={<RiskRegister />} />
        <Route path="/deal/:id/questions" element={<BrokerQuestions />} />
        <Route path="/deal/:id/summary" element={<InvestorSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
