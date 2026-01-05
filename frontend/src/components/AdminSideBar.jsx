import { NavLink, useNavigate } from 'react-router-dom'
import './adminSide.css'
import { useDispatch } from 'react-redux'
import { Logout } from '../JS/feature/authSlice'

// Barre latérale pour l'interface admin
// Contient les liens de navigation internes et le bouton de déconnexion
const AdminSideBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handler de logout : dispatch l'action puis redirige vers la page de login
  const handleLogout = async () => {
    try {
      await dispatch(Logout()).unwrap();
    } finally {
      navigate('/login');
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <div className="brand">Tableau de bord</div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <ul className="admin-menu">
          <li>
            {/* Lien vers le formulaire d'ajout d'utilisateur */}
            <NavLink to="register" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>Ajout d'un utilisateur</NavLink>
          </li>
          <li>
            {/* Lien vers la gestion des utilisateurs */}
            <NavLink to="users" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>Gérer les utilisateurs</NavLink>
          </li>
          <li>
            {/* Lien vers le dashboard ou paramètres */}
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'menu-link active' : 'menu-link'}>Profils de l'administrateur</NavLink>
          </li>
          <li>
            {/* Bouton de déconnexion */}
            <button type="button" className="menu-link" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">© {new Date().getFullYear()} MonProjet</div>
    </aside>
  )
}

export default AdminSideBar
