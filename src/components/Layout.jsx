import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import MobileChrome from './MobileChrome.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile chrome — top bar + bottom nav + more-sheet */}
      <MobileChrome />

      <div className="lg:mr-72">
        <main className="px-4 pt-[4.75rem] pb-28 sm:px-8 lg:px-14 lg:py-16 lg:pt-16 max-w-[1180px]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
