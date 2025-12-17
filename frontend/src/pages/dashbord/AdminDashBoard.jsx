// Page layout du dashboard admin
// Contient la sidebar (navigation admin) et un `Outlet` pour rendre les sous-routes
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSideBar from '../../components/AdminSideBar'
import './adminDashBoard.css'

const AdminDashBoard = () => {
  return (
    <div className="admin-dashboard">
      {/* Zone latérale contenant les liens d'administration */}
      <aside className="dashboard-aside">
        <AdminSideBar/>
      </aside>

      {/* Zone principale où apparaissent les pages enfants via <Outlet/> */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Outlet/>
        </div>
      </main>
    </div>
  )
}

export default AdminDashBoard
