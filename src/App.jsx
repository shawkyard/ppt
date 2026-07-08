import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import MapCommandCenter from './pages/MapCommandCenter.jsx'
import MarketGate from './pages/MarketGate.jsx'
import MarketLayerManager from './pages/MarketLayerManager.jsx'
import DealSourcingQueue from './pages/DealSourcingQueue.jsx'
import AddProperty from './pages/AddProperty.jsx'
import UploadWorkflow from './pages/UploadWorkflow.jsx'
import ScratchScreen from './pages/ScratchScreen.jsx'
import MotivatedSellers from './pages/MotivatedSellers.jsx'
import ReportBuilder from './pages/ReportBuilder.jsx'
import Settings from './pages/Settings.jsx'
import DealDetail from './pages/DealDetail.jsx'
import StabilizationPlan from './pages/StabilizationPlan.jsx'
import OfferPrice from './pages/OfferPrice.jsx'
import RiskRegister from './pages/RiskRegister.jsx'
import BrokerQuestions from './pages/BrokerQuestions.jsx'
import InvestorSummary from './pages/InvestorSummary.jsx'
import SignalsOutreach from './pages/SignalsOutreach.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapCommandCenter />} />
        <Route path="/markets" element={<MarketGate />} />
        <Route path="/layers" element={<MarketLayerManager />} />
        <Route path="/sourcing" element={<DealSourcingQueue />} />
        <Route path="/add" element={<AddProperty />} />
        <Route path="/upload" element={<UploadWorkflow />} />
        <Route path="/scratch" element={<ScratchScreen />} />
        <Route path="/motivated" element={<MotivatedSellers />} />
        <Route path="/reports" element={<ReportBuilder />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/deal/:id" element={<DealDetail />} />
        <Route path="/deal/:id/plan" element={<StabilizationPlan />} />
        <Route path="/deal/:id/offer" element={<OfferPrice />} />
        <Route path="/deal/:id/risk" element={<RiskRegister />} />
        <Route path="/deal/:id/questions" element={<BrokerQuestions />} />
        <Route path="/deal/:id/summary" element={<InvestorSummary />} />
        <Route path="/deal/:id/signals" element={<SignalsOutreach />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
