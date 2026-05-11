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
        <main className="px-4 pt-20 pb-10 sm:px-8 sm:py-12 lg:px-14 lg:py-16 lg:pt-16 max-w-[1180px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
