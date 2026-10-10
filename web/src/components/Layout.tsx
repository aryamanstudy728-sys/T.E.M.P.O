import { NavLink, Outlet } from 'react-router-dom'
import Icon from './Icon'
import Banner from './Banner'
import '../styles/shell.css'

export function Layout() {
  return (
    <div className="layout">
      <header className="app-header">
        <div aria-label="T.E.M.P.O. milk collection operations" className="brand">
          <div className="brand-mark">T</div>
          <div>
            <div className="brand-name">T.E.M.P.O.</div>
            <div className="brand-sub">Milk collection operations</div>
          </div>
        </div>

        <nav aria-label="Main navigation" className="top-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon name="layout-dashboard" />
            Dashboard
          </NavLink>
          <NavLink
            to="/routes"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon name="route" />
            Routes
          </NavLink>
          <NavLink
            to="/alerts"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon name="alert-triangle" />
            Alerts
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <Icon name="chart-bar" />
            Analytics
          </NavLink>
        </nav>

        <div aria-label="Simulation notice" className="header-state">
          <Banner />
        </div>
      </header>

      <Outlet />
    </div>
  )
}

export default Layout

