import { Routes, Route } from 'react-router-dom';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyOrdersPage from '../pages/MyOrdersPage';
import Register from '../pages/Register';
import ProductDetail from '../pages/ProductDetail';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/orders" element={<MyOrdersPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
);

export default AppRoutes;