import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Spiner from "../components/Spiner";

const matchesAdmin = (roles, target) => {
  if (!roles) return false;
  if (typeof roles === 'string') return roles === target;
  if (roles.titre) return roles.titre === target;
  if (Array.isArray(roles)) {
    return roles.some(r => (typeof r === 'string' ? r === target : r?.titre === target));
  }
  return false;
};

const PrivateRoute = ({ children, roles: allowedRoles } ) => {
  const { user, loading, initializing } = useSelector((state) => state.auth);

  if (loading) return <Spiner />;
  if (initializing && !user) return <Spiner />;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0) {
    const ok = allowedRoles.some(r => matchesAdmin(user?.roles, r));
    if (!ok) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
