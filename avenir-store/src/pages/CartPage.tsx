import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { state, dispatch } = useCart();

    console.log('STATE LEÍDO POR CARTPAGE', state.items);
    console.log('LONGITUD DEL CARRITO', state.items.length);

    const total = state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (state.items.length === 0) {
        return <h2>Tu carrito esta vacio</h2>
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Carrito</h2>

            {state.items.map(item => (
                <div
                   key={item._id}
                   style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #ddd',
                    paddingBottom: '0.5rem'
                   }}
                   >
                    <div>
                        <strong>{item.name}</strong>
                        <p>
                            ${item.price} x {item.quantity}
                        </p>
                    </div>

                    <button 
                    onClick={() => 
                        dispatch({ type: 'REMOVE_FROM_CART', payload: item._id })
                    }
                    >
                        Eliminar
                    </button>
                </div>    
            ))}

            <h3>Total: ${total}</h3>

            <button
              style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
              onClick={() => alert('Checkout proximo paso')}
            >
                Finalizar compra
            </button>
        </div>
    );
};

export default CartPage;