import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <button
        className="menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="פתח תפריט"
      >
        ☰
      </button>

      <div className="lg:mr-72">
        <main className="px-5 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16 max-w-[1180px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
