import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login-register.css'
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../JS/feature/toastSlice';
import { useNavigate } from 'react-router-dom';
import { Login as loginAction, Logout } from '../../JS/feature/authSlice';
import { BACKEND_BASE_URL } from '../../api/axios';

// Image utilisée dans les messages d'avertissement
const WARNING_IMAGE_URL = `${BACKEND_BASE_URL}/uploads/istockphoto-502381843-1024x1024.jpg`;

  // Composant page Login (interface d'authentification)
  const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Si déjà connecté, rediriger vers le dashboard
  useEffect(() => {
    if (user) navigate('/admin/dashboard');
  }, [user, navigate]);

  // Etat du formulaire
  const [userToConnect, setUserToConnect] = useState({
    email: '',
    password: '',
  });
  // Etat pour afficher un avertissement (ex: accès non-admin, erreur API)
  const [warning, setWarning] = useState(null);
  // Contrôles d'affichage des toast notifications (gérés globalement)

  // Met à jour le state du formulaire lors de la saisie
  const handleChange = (e) => {
    setUserToConnect({ ...userToConnect, [e.target.name]: e.target.value });
  };

  // load remembered email once (after state is defined)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rememberEmail');
      if (saved) {
        setUserToConnect((s) => ({ ...s, email: saved }));
        setRememberMe(true);
      }
    } catch {}
  }, []);

  const togglePasswordLocal = () => setShowPassword((s) => !s);

  const handleRememberLocal = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    if (!checked) {
      try { localStorage.removeItem('rememberEmail'); } catch {}
    }
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
        const msg = 'Accès réservé aux administrateurs. Les comptes classiques ne peuvent pas se connecter ici.';
        setWarning({ message: msg, image: WARNING_IMAGE_URL });
        // Emit global toast so it survives navigation/unmount
        dispatch(showToast({ message: msg, variant: 'warning', delay: 4500 }));
        // Retarder le logout pour laisser le toast visible
        setTimeout(() => {
          dispatch(Logout());
        }, 3500);
        return;
      }

      // Succès : afficher un message puis rediriger
      const success = 'Connexion réussie — vous êtes redirigé.';
      dispatch(showToast({ message: success, variant: 'success', delay: 1400 }));
      // remember email if requested
      try {
        if (rememberMe) localStorage.setItem('rememberEmail', userToConnect.email);
        else localStorage.removeItem('rememberEmail');
      } catch {}
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
      dispatch(showToast({ message, variant: 'warning', delay: 4500 }));
    }
  };

  return (
    <div className="formulaire">
      <h2>Login</h2>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: 16 }}>Connectez-vous pour accéder au tableau de bord administrateur</p>

      {/* Carte d'avertissement affichée si `warning` est défini */}
      {warning && (
        <div className="warning-card">
          <img
            className="warning-image"
            src={warning.image}
            alt="Attention"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${BACKEND_BASE_URL}/uploads/1765295184175-203176977.png`;
            }}
          />
          <p className="warning-text">{warning.message}</p>
        </div>
      )}

      

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
          <div style={{ position: 'relative' }}>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={userToConnect.password}
              required
              style={{ paddingRight: 46 }}
            />
            <button type="button" onClick={togglePasswordLocal} aria-label="toggle password" style={{ position: 'absolute', right: 8, top: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18 }}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </Form.Group>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input id="rememberMe" type="checkbox" checked={rememberMe} onChange={handleRememberLocal} />
            <label htmlFor="rememberMe" className="remember-label" style={{ margin: 0 }}>Remember me</label>
          </div>
          <a href="#" onClick={(e)=>{e.preventDefault(); dispatch(showToast({ message: 'Password reset flow not implemented', variant: 'info' }));}} style={{ color: '#64748b' }}>Forgot?</a>
        </div>

        <div className="form-actions">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading && (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            )}
            {loading ? 'Connecting...' : 'Login'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login
