import { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import api from '../../api/axios';

// Page d'administration permettant de lister, modifier et supprimer des utilisateurs
const ManageUsers = () => {
  // Liste des utilisateurs et états de chargement/erreur
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Edition inline : id de l'utilisateur en cours d'édition et formulaire temporaire
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    userName: '',
    email: '',
    phone: '',
    roleTitre: '',
    file: null,
    preview: null,
  });

  // Tri alphabétique des utilisateurs (memoisé pour perf)
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const aName = (a.userName || '').toLowerCase();
      const bName = (b.userName || '').toLowerCase();
      return aName.localeCompare(bName);
    });
  }, [users]);

  // Récupère la liste des utilisateurs depuis l'API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (err) {
      // Normalise les erreurs pour l'affichage
      setError(err?.response?.data?.errors || err?.response?.data?.error || [{ message: err?.message || 'Failed to load users' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chargement initial des utilisateurs
    fetchUsers();
  }, []);

  // Démarre l'édition d'un utilisateur en remplissant le formulaire temporaire
  const startEdit = (user) => {
    setEditingId(user._id);
    setEditForm({
      userName: user.userName || '',
      email: user.email || '',
      phone: user.phone || '',
      roleTitre: user?.roles?.titre || '',
      file: null,
      preview: null,
    });
  };

  // Annule l'édition en réinitialisant l'état et en révoquant l'URL de preview si besoin
  const cancelEdit = () => {
    setEditingId(null);
    if (editForm.preview) URL.revokeObjectURL(editForm.preview);
    setEditForm({ userName: '', email: '', phone: '', roleTitre: '', file: null, preview: null });
  };

  // Sauvegarde les modifications : si un fichier est présent on envoie un FormData
  const saveEdit = async (id) => {
    setError(null);
    try {
      if (editForm.file) {
        const data = new FormData();
        data.append('userName', editForm.userName);
        data.append('email', editForm.email);
        data.append('phone', editForm.phone);
        data.append('roleTitre', editForm.roleTitre);
        data.append('profilePic', editForm.file);
        await api.put(`/users/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.put(`/users/${id}`, {
          userName: editForm.userName,
          email: editForm.email,
          phone: editForm.phone,
          roleTitre: editForm.roleTitre,
        });
      }
      // Rafraîchit la liste et quitte le mode édition
      await fetchUsers();
      cancelEdit();
    } catch (err) {
      setError(err?.response?.data?.errors || err?.response?.data?.error || [{ message: err?.message || 'Failed to update user' }]);
    }
  };

  // Supprime un utilisateur et rafraîchit la liste
  const deleteUser = async (id) => {
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.errors || err?.response?.data?.error || [{ message: err?.message || 'Failed to delete user' }]);
    }
  };

  return (
    <div>
      <h3>Manage Users</h3>

      <div style={{ marginBottom: 12 }}>
        <Button variant="secondary" onClick={fetchUsers} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      {/* Affiche les erreurs si présentes */}
      {Array.isArray(error) && error.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          {error.map((e, idx) => (
            <div key={idx} style={{ color: 'crimson' }}>{e.message}</div>
          ))}
        </div>
      )}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>UserName</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th style={{ width: 260 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((u) => {
            const isEditing = editingId === u._id;
            return (
              <tr key={u._id}>
                <td>
                  {!isEditing ? (
                    // Affiche l'avatar en lecture seule
                    <img src={u.profilePic || 'https://avatar.iran.liara.run/public'} alt="avatar" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                  ) : (
                    // Mode édition : aperçu et contrôle de fichier
                    <div>
                      {editForm.preview ? (
                        <img src={editForm.preview} alt="preview" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      ) : (
                        <img src={u.profilePic || 'https://avatar.iran.liara.run/public'} alt="avatar" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                      )}
                      <Form.Control type="file" accept="image/*" size="sm" onChange={(e) => {
                        const f = e.target.files[0];
                        setEditForm((p) => ({ ...p, file: f, preview: f ? URL.createObjectURL(f) : null }));
                      }} style={{ marginTop: 6 }} />
                    </div>
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control
                      name="userName"
                      value={editForm.userName}
                      onChange={(e) => setEditForm((p) => ({ ...p, userName: e.target.value }))}
                    />
                  ) : (
                    u.userName
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control
                      name="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                    />
                  ) : (
                    u.phone
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <Form.Control
                      name="roleTitre"
                      value={editForm.roleTitre}
                      placeholder="ADMIN / RECRUT / CONSULTANT"
                      onChange={(e) => setEditForm((p) => ({ ...p, roleTitre: e.target.value }))}
                    />
                  ) : (
                    u?.roles?.titre
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <>
                      <Button variant="primary" size="sm" onClick={() => saveEdit(u._id)}>
                        Save
                      </Button>{' '}
                      <Button variant="outline-secondary" size="sm" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline-primary" size="sm" onClick={() => startEdit(u)}>
                        Edit
                      </Button>{' '}
                      <Button variant="outline-danger" size="sm" onClick={() => deleteUser(u._id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}

          {sortedUsers.length === 0 && !loading && (
            <tr>
              <td colSpan={6}>No users.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageUsers;
