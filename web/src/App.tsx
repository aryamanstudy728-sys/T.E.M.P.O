import { Routes as RouterRoutes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Routes from './pages/Routes'
import Alerts from './pages/Alerts'
import Analytics from './pages/Analytics'

export function App() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="routes" element={<Routes />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </RouterRoutes>
  )
}

export default App
