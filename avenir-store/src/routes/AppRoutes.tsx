import { Routes, Route } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
    </Routes>
);

export default AppRoutes;