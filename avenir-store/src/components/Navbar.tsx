import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { logout } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleLogout = () => {
    logout();
    dispatch({ type: 'CLEAR_CART' });
    navigate('/login');
  };

  const totalQuantity = state.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  console.log('NAVBAR RENDER - ITEMS:', state.items);
  console.log('NAVBAR TOTAL:', totalQuantity);

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Inicio</Link>
      <Link to="/cart">Carrito{` (${totalQuantity})`}</Link>

      {isAuthenticated ? (
        <button onClick={handleLogout} type="button">
          Cerrar sesión
        </button>
      ) : (
        <Link to="/login">Iniciar sesión</Link>
      )}
    </nav>
  );
}
