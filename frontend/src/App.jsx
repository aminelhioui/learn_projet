import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Current } from "./JS/feature/authSlice";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashBoard from "./pages/dashbord/AdminDashBoard";
import AdminHome from "./pages/dashbord/AdminHome";
import ManageUsers from "./pages/dashbord/ManageUsers";
import Unautorized from "./pages/Unautorized";
import "./App.css";
import "./styles/toast.css";
import Footer from "./components/Footer";
import NavBare from "./components/NavBare";
import GlobalToast from "./components/GlobalToast";
import { useSelector } from "react-redux";
import AdminRoute from "./routes/adminRoute"; 
function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Initialise l'utilisateur courant depuis le cookie au démarrage
    dispatch(Current());
  }, [dispatch]);

  // Ne pas afficher la navbar/footer sur la page de login ('/' ou '/login'),
  // sauf si l'utilisateur est déjà connecté.
  const hideOnPaths = ["/", "/login"];
  const showNavFooter =
    !hideOnPaths.includes(location.pathname) || Boolean(user);

  return (
    <>
      {showNavFooter && <NavBare />}
      <GlobalToast />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashBoard />
            </AdminRoute>
          }
        >
          <Route index element={<AdminHome />} />
          <Route path="register" element={<Register />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        <Route path="/unauthorized" element={<Unautorized />} />
      </Routes>
      {showNavFooter && <Footer />}
    </>
  );
}

export default App;
