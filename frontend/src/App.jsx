import { Routes , Route } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from "./pages/auth/register";
import AdminDashBoard from "./pages/dashbord/AdminDashBoard";
import Unautorized from "./pages/Unautorized";
import './App.css'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />}/>

      <Route path="/admin/dashboard" element={<AdminDashBoard />}>
        <Route path="register" element={<Register />}/>
      </Route>

      
      <Route path="/unauthorized" element={<Unautorized />}/>
    </Routes>
    </>

  )
}

export default App
