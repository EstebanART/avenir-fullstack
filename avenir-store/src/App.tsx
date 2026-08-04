import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { logout } from './services/api';
import AppRoutes from './routes/AppRoutes';

function App() {
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    logout();
    dispatch({ type: 'CLEAR_CART' });
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link to="/">Inicio</Link>
        <Link to="/cart">Carrito</Link>
        {isAuthenticated ? (
          <button onClick={handleLogout} type="button">Cerrar sesión</button>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </nav>
      <AppRoutes />
    </div>
  );
}

export default App;
