/*
  ManageUsers.jsx
  ----------------
  Page d'administration listant les utilisateurs et permettant de les modifier/supprimer.

  Notes (FR):
  - Affiche la liste triée des utilisateurs (`fetchUsers`).
  - Edition inline : `startEdit`, `saveEdit`, `cancelEdit`.
  - Suppression : `deleteUser` (le bouton "Supprimer" est masqué pour les utilisateurs
    dont `u?.roles?.titre === 'ADMIN'` afin d'éviter une suppression accidentelle d'admin
    côté UI).
  - Modifications récentes : remplacement des boutons texte "Modifier/Supprimer"
    et "Sauver/Annuler" par des boutons icônes (`react-icons`) pour une interface
    plus claire et attractive.

  Remarque technique : les fichiers `package.json` ne supportent pas les commentaires
  JSON — pour documenter les scripts/dépendances, voir le fichier `README-fr.md`
  à la racine du projet.
*/

import { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from 'react-icons/fa';
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

  // Récupère la liste des rôles depuis l'API pour le select d'édition
  const [roles, setRoles] = useState([]);
  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      // res.data.roles = [{ titre: 'ADMIN' }, ...]
      setRoles(res.data.roles || []);
    } catch {
      // ignore silently — on garde la liste vide si erreur
      setRoles([]);
    }
  };

  useEffect(() => {
    // Chargement initial des utilisateurs
    fetchUsers();
    fetchRoles();
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
    <div className="manage-users-container">
      <div className="dashboard-header mb-4">
        <h1>Gestion des Utilisateurs</h1>
        
      </div>

      <div className="mb-4">
        <Button variant="primary" className="rounded-pill px-4" onClick={fetchUsers} disabled={loading}>
          {loading ? 'Chargement...' : 'Actualiser la liste'}
        </Button>
      </div>

      {/* Affiche les erreurs si présentes */}
      {Array.isArray(error) && error.length > 0 && (
        <div className="alert alert-danger border-0 shadow-sm mb-4">
          {error.map((e, idx) => (
            <div key={idx}>{e.message}</div>
          ))}
        </div>
      )}

      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">Avatar</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">Nom</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">Email</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">Téléphone</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted">Rôle</th>
                <th className="px-4 py-3 border-0 text-uppercase small fw-bold text-muted text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => {
                const isEditing = editingId === u._id;
                return (
                  <tr key={u._id} className="transition-all">
                    <td className="px-4 py-3">
                      {!isEditing ? (
                        // Affiche l'avatar en lecture seule
                        <img src={u.profilePic || 'https://avatar.iran.liara.run/public'} alt="avatar" className="rounded-circle border" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                      ) : (
                        // Mode édition : aperçu et contrôle de fichier
                        <div className="position-relative" style={{ width: 48, height: 48 }}>
                          {editForm.preview ? (
                            <img src={editForm.preview} alt="preview" className="rounded-circle border" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                          ) : (
                            <img src={u.profilePic || 'https://avatar.iran.liara.run/public'} alt="avatar" className="rounded-circle border" style={{ width: 48, height: 48, objectFit: 'cover' }} />
                          )}
                          <Form.Control type="file" accept="image/*" size="sm" className="position-absolute top-0 start-0 opacity-0 w-100 h-100 cursor-pointer" onChange={(e) => {
                            const f = e.target.files[0];
                            setEditForm((p) => ({ ...p, file: f, preview: f ? URL.createObjectURL(f) : null }));
                          }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Form.Control
                          name="userName"
                          value={editForm.userName}
                          onChange={(e) => setEditForm((p) => ({ ...p, userName: e.target.value }))}
                          className="rounded-pill px-3"
                        />
                      ) : (
                        <span className="fw-semibold text-dark">{u.userName}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Form.Control
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                          className="rounded-pill px-3"
                        />
                      ) : (
                        <span className="text-muted">{u.email}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Form.Control
                          name="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                          className="rounded-pill px-3"
                        />
                      ) : (
                        <span className="text-muted">{u.phone}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <Form.Select
                          name="roleTitre"
                          value={editForm.roleTitre}
                          onChange={(e) => setEditForm((p) => ({ ...p, roleTitre: e.target.value }))}
                          className="rounded-pill px-3"
                        >
                          <option value="">-- Choisir un rôle --</option>
                          {roles.map((r) => (
                            <option key={r.titre} value={r.titre}>{r.titre}</option>
                          ))}
                        </Form.Select>
                      ) : (
                        <span className={`badge rounded-pill px-3 py-2 ${
                          u?.roles?.titre === 'ADMIN' ? 'bg-danger-subtle text-danger' : 
                          u?.roles?.titre === 'RECRUT' ? 'bg-primary-subtle text-primary' : 
                          'bg-success-subtle text-success'
                        }`}>
                          {u?.roles?.titre}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      {isEditing ? (
                        <div className="d-flex justify-content-end gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                            onClick={() => saveEdit(u._id)}
                            title="Sauver"
                          >
                            <FaCheck />
                            <span className="visually-hidden">Sauver</span>
                          </Button>
                          <Button
                            variant="light"
                            size="sm"
                            className="rounded-circle p-2 d-flex align-items-center justify-content-center border"
                            onClick={cancelEdit}
                            title="Annuler"
                          >
                            <FaTimes />
                            <span className="visually-hidden">Annuler</span>
                          </Button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-end gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                              onClick={() => startEdit(u)}
                              title="Modifier"
                            >
                              <FaEdit />
                              <span className="visually-hidden">Modifier</span>
                            </Button>
                            {u?.roles?.titre !== 'ADMIN' && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                                onClick={() => deleteUser(u._id)}
                                title="Supprimer"
                              >
                                <FaTrashAlt />
                                <span className="visually-hidden">Supprimer</span>
                              </Button>
                            )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {sortedUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">Aucun utilisateur trouvé.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
