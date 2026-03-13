import { Routes, Route } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import Home from '../pages/Home';
import Login from '../pages/Login';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
    </Routes>
);

export default AppRoutes;