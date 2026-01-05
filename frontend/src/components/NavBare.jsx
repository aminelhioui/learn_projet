import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logout } from '../JS/feature/authSlice';

// Barre de navigation principale (composant présentiel)
// Contient des liens statiques d'exemple; à adapter selon les routes de l'application
function NaveBare() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(Logout());
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-white border-bottom py-3 sticky-top">
      <Container>
        {/* Marque / logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-4">
          Mon Projet
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Liens supprimés à la demande de l'utilisateur */}
          </Nav>
          
          <Nav className="align-items-center gap-2">
            {user ? (
              <NavDropdown 
                title={
                  <div className="d-inline-flex align-items-center gap-2">
                    <img 
                      src={user.profilePic || 'https://avatar.iran.liara.run/public'} 
                      alt="avatar" 
                      width="32" 
                      height="32" 
                      className="rounded-circle border"
                    />
                    <span className="fw-semibold">{user.userName}</span>
                  </div>
                } 
                id="basic-nav-dropdown"
                align="end"
                className="user-dropdown"
              >
                
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
                  Déconnexion
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
               
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className="btn btn-primary text-white px-4 rounded-pill fw-semibold ms-lg-2"
                >
                  S'inscrire
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NaveBare;