import { useState } from 'react';

import { useCart } from '../context/CartContext';
import api from '../services/api';

interface CreatedOrder {
    _id: string;
    total?: number;
    status?: string;
}

const CheckoutPage = () => {
    const { state, dispatch } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);

    const subtotalVisual = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (state.items.length === 0) {
            setMessage('Tu carrito está vacío');
            return;
        }

        const token = localStorage.getItem('token');

        if (!token) {
            setMessage('No hay una sesión activa.');
            return;
        }

        setIsProcessing(true);
        setMessage('');
        setCreatedOrder(null);

        try {
            const response = await api.post<CreatedOrder>('/orders', {
                products: state.items.map(item => ({
                    product: item._id,
                    quantity: item.quantity
                }))
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            dispatch({ type: 'CLEAR_CART' });
            setCreatedOrder(response.data);
            setMessage('Pedido creado correctamente.');
        } catch (error) {
            setMessage('No se pudo crear el pedido.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (state.items.length === 0) {
        return (
            <div>
                <h2>Tu carrito está vacío</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>Resumen del pedido</h2>

            <div>
                {state.items.map(item => {
                    const itemSubtotal = item.price * item.quantity;
                    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';

                    return (
                        <div key={item._id}>
                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    alt={item.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                            )}
                            <div>
                                <h3>{item.name}</h3>
                                <p>Precio: ${item.price}</p>
                                <p>Cantidad: {item.quantity}</p>
                                <p>Subtotal: ${itemSubtotal}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div>
                <h3>Total: ${subtotalVisual}</h3>
            </div>

            <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
            >
                {isProcessing ? 'Procesando pedido...' : 'Confirmar pedido'}
            </button>

            {message && <p>{message}</p>}
            {createdOrder && (
                <div>
                    <p>ID del pedido: {createdOrder._id}</p>
                    {typeof createdOrder.total === 'number' && (
                        <p>Total confirmado: ${createdOrder.total}</p>
                    )}
                    {createdOrder.status && <p>Estado: {createdOrder.status}</p>}
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
