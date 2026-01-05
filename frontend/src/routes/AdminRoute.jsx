import PrivateRoute from "./PrivateRoute";

const AdminRoute = ({ children }) => {
  return <PrivateRoute roles={["ADMIN"]}>{children}</PrivateRoute>;
};

export default AdminRoute;
