import { Routes , Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from "./pages/auth/register";
import AdminDashBoard from "./pages/dashbord/AdminDashBoard";
import AdminHome from "./pages/dashbord/AdminHome";
import ManageUsers from "./pages/dashbord/ManageUsers";
import Unautorized from "./pages/Unautorized";
import './App.css'
import Footer from './components/Footer'
import NavBare from './components/NavBare';

function App() {

  return (
    <>
    <NavBare />
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />}/>

      <Route path="/admin/dashboard" element={<AdminDashBoard />}>
        <Route index element={<AdminHome />} />
        <Route path="register" element={<Register />}/>
        <Route path="users" element={<ManageUsers />}/>
      </Route>

      
      <Route path="/unauthorized" element={<Unautorized />}/>
    </Routes>
    <Footer />
    </>

  )
}

export default App
