
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import InventoryDashboard from './pages/InventoryDashboard.jsx'
import ProductDetails from './pages/ProductDetails.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<InventoryDashboard />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
