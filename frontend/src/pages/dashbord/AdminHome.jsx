// Page d'accueil du dashboard admin
// Affiche des informations basiques sur l'utilisateur connecté
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Current } from '../../JS/feature/authSlice';

const AdminHome = () => {
  const dispatch = useDispatch();
  // Récupère l'utilisateur courant et l'état d'initialisation depuis le store
  const { user, initializing } = useSelector((state) => state.auth);

  // Au montage, si l'utilisateur n'est pas chargé, on dispatch l'action Current()
  useEffect(() => {
    if (!user) {
      dispatch(Current());
    }
  }, [dispatch, user]);

  if (initializing) {
    // Affiche un état de chargement pendant l'initialisation
    return <div>Loading...</div>;
  }

  if (!user) {
    // Si aucun utilisateur trouvé, afficher un message (accès non authentifié)
    return <div>No user connected.</div>;
  }

  // Affiche quelques informations de l'utilisateur pour vérification
  return (
    <div>
      {/* Affiche l'avatar de l'utilisateur connecté (ou une image par défaut) */}
      <div style={{ marginBottom: 12 }}>
        <img
          src={user.profilePic || 'https://avatar.iran.liara.run/public'}
          alt="avatar"
          style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12 }}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://avatar.iran.liara.run/public'; }}
        />
      </div>
      <h3>Connected user</h3>
      <p><strong>Name:</strong> {user.userName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user?.roles?.titre || user?.roles || user?.role}</p>
    </div>
  );
};

export default AdminHome;
