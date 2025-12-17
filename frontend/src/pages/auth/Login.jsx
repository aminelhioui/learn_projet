import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login-register.css'
import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Login as loginAction, Logout } from '../../JS/feature/authSlice';
import { BACKEND_BASE_URL } from '../../api/axios';

// Image utilisée dans les messages d'avertissement
const WARNING_IMAGE_URL = `${BACKEND_BASE_URL}/uploads/istockphoto-502381843-1024x1024.jpg`;

// Composant page Login (interface d'authentification)
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Etat du formulaire
  const [userToConnect, setUserToConnect] = useState({
    email: '',
    password: '',
  });
  // Etat pour afficher un avertissement (ex: accès non-admin, erreur API)
  const [warning, setWarning] = useState(null);
  // Contrôles d'affichage des toasts (messages popup)
  const [showToast, setShowToast] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Met à jour le state du formulaire lors de la saisie
  const handleChange = (e) => {
    setUserToConnect({ ...userToConnect, [e.target.name]: e.target.value });
  };

  // Soumet le formulaire de connexion
  // - appelle l'action Redux `loginAction`
  // - vérifie si l'utilisateur a le rôle ADMIN
  // - affiche des toasts et redirige vers le dashboard admin en cas de succès
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Submitting login...', userToConnect.email);
    setWarning(null);
    try {
      // dispatch de l'action de login (asynchrone)
      const { user } = await dispatch(loginAction(userToConnect)).unwrap();

      // Si l'utilisateur n'est pas ADMIN, on refuse l'accès ici
      if (user?.roles?.titre !== 'ADMIN') {
        setWarning({
          message:
            'Accès réservé aux administrateurs. Les comptes classiques ne peuvent pas se connecter ici.',
          image: WARNING_IMAGE_URL,
        });
        setShowToast(true);
        // effectue un logout côté client pour être sûr
        await dispatch(Logout());
        return;
      }

      // Succès : afficher un message puis rediriger
      setSuccessMsg('Connexion réussie — vous êtes redirigé.');
      setShowSuccess(true);
      // Réinitialise le formulaire avant navigation
      setUserToConnect({ email: '', password: '' });
      setTimeout(() => navigate('/admin/dashboard'), 900);
    } catch (err) {
      // Gestion des erreurs : log et affichage d'un message utilisateur
      console.error('Login failed:', err);
      const fallback = 'Erreur lors de la connexion. Vérifiez vos identifiants.';
      const message = Array.isArray(err)
        ? err[0]?.message || fallback
        : err?.message || fallback;
      setWarning({ message, image: WARNING_IMAGE_URL });
      setShowToast(true);
    }
  };

  return (
    <div className="formulaire">
      <h2>Login</h2>

      {/* Carte d'avertissement affichée si `warning` est défini */}
      {warning && (
        <div className="warning-card">
          <img
            className="warning-image"
            src={warning.image}
            alt="Attention"
            onError={(e) => {
              // En cas d'erreur de chargement de l'image, remplacer par une image par défaut
              e.target.onerror = null;
              e.target.src = `${BACKEND_BASE_URL}/uploads/1765295184175-203176977.png`;
            }}
          />
          <p className="warning-text">{warning.message}</p>
        </div>
      )}

      {/* Toast pour les messages d'avertissement */}
      <ToastContainer position="top-end" className="p-3">
        <Toast onClose={() => setShowToast(false)} show={showToast} autohide delay={4500} bg="warning">
          <Toast.Header>
            <img src={warning?.image || WARNING_IMAGE_URL} className="rounded me-2" alt="img" style={{ width: 20, height: 20, objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = `${BACKEND_BASE_URL}/uploads/1765295184175-203176977.png`; }} />
            <strong className="me-auto">Accès refusé</strong>
          </Toast.Header>
          <Toast.Body>{warning?.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Toast pour les messages de succès */}
      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} autohide delay={1200} bg="success">
          <Toast.Header>
            <strong className="me-auto">Succès</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{successMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Formulaire de connexion */}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            onChange={handleChange}
            value={userToConnect.email}
            required
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={userToConnect.password}
            required
          />
        </Form.Group>

        <div className="form-actions">
          <Button variant="primary" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login
