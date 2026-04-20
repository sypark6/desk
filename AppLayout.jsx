import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-off">
      <Sidebar />
      <div className="ml-60 flex-1 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
