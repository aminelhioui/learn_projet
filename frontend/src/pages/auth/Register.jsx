import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './login-register.css'
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Register as registerAction } from '../../JS/feature/authSlice';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Etat du formulaire
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    phone: '',
    roleTitre: '',
  });
  // Fichier choisi et aperçu local
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gère la sélection d'un fichier (image de profil)
  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  // Soumet le formulaire : construit un FormData et appelle l'action Redux `registerAction`
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    try {
      const data = new FormData();
      data.append('userName', form.userName);
      data.append('email', form.email);
      data.append('password', form.password);
      data.append('phone', form.phone);
      data.append('roleTitre', form.roleTitre);
      if (file) data.append('profilePic', file);

      await dispatch(registerAction(data)).unwrap();
      // Réinitialise le formulaire, affiche un toast de succès et redirige
      setForm({ userName: '', email: '', password: '', phone: '', roleTitre: '' });
      setFile(null);
      setPreview(null);
      setSuccessMsg('Utilisateur créé avec succès');
      setShowSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 900);
    } catch (err) {
      // Affiche les erreurs renvoyées par l'API (ou un message générique)
      setErrors(err || [{ message: 'Registration failed' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formulaire">
      <h1>Create a new User</h1>
      {Array.isArray(errors) && errors.map((e, i) => (
        <div key={i} style={{ color: 'crimson', marginBottom: 8 }}>{e.message}</div>
      ))}

      {/* Toast de succès */}
      <ToastContainer position="top-center" className="p-3">
        <Toast onClose={() => setShowSuccess(false)} show={showSuccess} autohide delay={1200} bg="success">
          <Toast.Header>
            <strong className="me-auto">Succès</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{successMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Control
            name="userName"
            value={form.userName}
            onChange={handleChange}
            type="text"
            placeholder="Enter user name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Enter email"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter password"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="text"
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select name="roleTitre" value={form.roleTitre} onChange={handleChange} required>
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="RECRUT">Recruter</option>
            <option value="CONSULTANT">Consultant</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile picture (optional)</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleFile} />
          {preview && <img src={preview} alt="preview" style={{ width: 80, height: 80, marginTop: 8, objectFit: 'cover', borderRadius: 8 }} />}
        </Form.Group>

        <div className="form-actions">
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Submit'}</Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
