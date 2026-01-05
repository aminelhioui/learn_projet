// Page d'accueil du dashboard admin
// Affiche des informations basiques sur l'utilisateur connecté
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Current } from '../../JS/feature/authSlice';

const AdminHome = () => {
  const dispatch = useDispatch();
  // Récupère l'utilisateur courant et l'état d'initialisation depuis le store
  const { user, initializing } = useSelector((state) => state.auth);

  // Statistiques dérivées de `user` (pas besoin de state + effect)
  const stats = useMemo(() => {
    const baseStats = {
      actionsThisWeek: 0,
      lastLoginText: 'Aucune connexion enregistrée',
    };

    if (!user) {
      return baseStats;
    }

    const newStats = { ...baseStats };

    // Dernière connexion
    try {
      newStats.lastLoginText = user.lastLogin
        ? new Date(user.lastLogin).toLocaleString()
        : 'Aucune connexion enregistrée';
    } catch {
      newStats.lastLoginText = 'Aucune connexion enregistrée';
    }

    // Actions de la semaine
    try {
      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const count = (user.actionTimestamps || []).filter(
        (t) => new Date(t).getTime() >= weekAgo
      ).length;
      newStats.actionsThisWeek = count;
    } catch {
      newStats.actionsThisWeek = 0;
    }

    return newStats;
  }, [user?.lastLogin, user?.actionTimestamps]);

  // Au montage, si l'utilisateur n'est pas chargé, on dispatch l'action Current()
  useEffect(() => {
    if (!user) {
      dispatch(Current());
    }
  }, [dispatch, user]);

  // Polling léger pour rafraîchir les statistiques en temps réel (tous les 30s)
  useEffect(() => {
    const id = setInterval(() => {
      dispatch(Current());
    }, 30000);
    return () => clearInterval(id);
  }, [dispatch]);

  if (initializing) {
    // Affiche un état de chargement pendant l'initialisation
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Si aucun utilisateur trouvé, afficher un message (accès non authentifié)
    return <div className="alert alert-warning">Aucun utilisateur connecté.</div>;
  }

  // Affiche quelques informations de l'utilisateur pour vérification
  return (
    <div className="admin-home-content">
      <div className="dashboard-header mb-4">
        <h1>Bienvenue, {user.userName} !</h1>
      </div>

      <div className="card-grid">
        <div className="card profile-card">
          <div className="d-flex align-items-center gap-4">
            <img
              src={user.profilePic || 'https://avatar.iran.liara.run/public'}
              alt="avatar"
              className="profile-image"
              style={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '50%',
                border: '4px solid #eef2ff',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://avatar.iran.liara.run/public';
              }}
            />
            <div>
              <h3 className="mb-1">{user.userName}</h3>
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                {user?.roles?.titre || user?.roles || user?.role}
              </span>
            </div>
          </div>

          <hr className="my-4" style={{ opacity: 0.1 }} />

          <div className="profile-details">
            <div className="detail-item mb-3">
              <label className="text-muted small text-uppercase fw-bold">Email</label>
              <p className="mb-0 fw-semibold">{user.email}</p>
            </div>
            <div className="detail-item">
              <label className="text-muted small text-uppercase fw-bold">ID Utilisateur</label>
              <p className="mb-0 font-monospace small">{user._id}</p>
            </div>
          </div>
        </div>

        <div className="card stats-card">
          <h4 className="mb-4">Statistiques rapides</h4>
          <div className="d-flex flex-column gap-3">
            <div className="p-3 rounded-3 bg-light border">
              <div className="text-muted small">Dernière connexion</div>
              <div className="fw-bold">{stats.lastLoginText}</div>
            </div>
            <div className="p-3 rounded-3 bg-light border">
              <div className="text-muted small">Actions effectuées</div>
              <div className="fw-bold">{user.actionCount ?? 0} actions</div>
              <div className="text-muted small">Cette semaine</div>
              <div className="fw-semibold">{stats.actionsThisWeek} actions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
