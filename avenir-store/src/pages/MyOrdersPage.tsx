import { useEffect, useState } from 'react';

import api from '../services/api';

interface OrderProduct {
    product: string;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    _id: string;
    user: string;
    products: OrderProduct[];
    total: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const MyOrdersPage = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

    const handleCancelOrder = async (orderId: string) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('No hay una sesión activa.');
            return;
        }

        setCancellingOrderId(orderId);

        try {
            const response = await api.patch<Order>(
                `/orders/${orderId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: response.data.status } : order
                )
            );
        } catch {
            setError('No se pudo cancelar el pedido.');
        } finally {
            setCancellingOrderId(null);
        }
    };

    useEffect(() => {
        const loadOrders = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                setError('No hay una sesión activa.');
                return;
            }

            try {
                const response = await api.get<Order[]>('/orders/my', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setOrders(response.data);
                setError('');
            } catch {
                setError('No se pudieron cargar tus pedidos.');
            } finally {
                setLoading(false);
            }
        };

        void loadOrders();
    }, []);

    if (loading) {
        return <p>Cargando pedidos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (orders.length === 0) {
        return <p>No tienes pedidos todavía.</p>;
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Mis pedidos</h2>

            {orders.map(order => (
                <div
                    key={order._id}
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <p>
                        <strong>ID del pedido:</strong> {order._id}
                    </p>
                    <p>
                        <strong>Fecha:</strong>{' '}
                        {new Date(order.createdAt).toLocaleString()}
                    </p>
                    <p>
                        <strong>Estado:</strong> {order.status}
                    </p>

                    <div>
                        {order.products.map(product => {
                            const subtotal = product.price * product.quantity;

                            return (
                                <div
                                    key={`${order._id}-${product.product}`}
                                    style={{
                                        borderTop: '1px solid #eee',
                                        marginTop: '0.5rem',
                                        paddingTop: '0.5rem'
                                    }}
                                >
                                    <p>
                                        <strong>Producto:</strong> {product.name}
                                    </p>
                                    <p>
                                        <strong>Precio:</strong> ${product.price}
                                    </p>
                                    <p>
                                        <strong>Cantidad:</strong> {product.quantity}
                                    </p>
                                    <p>
                                        <strong>Subtotal:</strong> ${subtotal}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <p>
                        <strong>Total de la orden:</strong> ${order.total}
                    </p>

                    {order.status === 'pending' && (
                        <button
                            type="button"
                            onClick={() => void handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {cancellingOrderId === order._id ? 'Cancelando...' : 'Cancelar pedido'}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MyOrdersPage;
