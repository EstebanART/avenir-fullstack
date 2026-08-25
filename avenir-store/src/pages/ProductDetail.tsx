import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';

interface Product {
	_id: string;
	name: string;
	description?: string;
	price: number;
	images?: string[];
	category?: string[];
	stock?: number;
}

const ProductDetail = () => {
	const { id } = useParams<{ id: string }>();
	const { dispatch } = useCart();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				setLoading(true);
				setError(false);
				const response = await api.get<Product>(`/products/${id}`);
				setProduct(response.data);
			} catch {
				setError(true);
			} finally {
				setLoading(false);
			}
		};

		if (id) {
			fetchProduct();
		} else {
			setError(true);
			setLoading(false);
		}
	}, [id]);

	if (loading) {
		return <p>Cargando producto...</p>;
	}

	if (error || !product) {
		return <p>No se pudo cargar el producto.</p>;
	}

	return (
		<div style={{ padding: '1rem' }}>
			{product.images?.[0] && (
				<img
					src={product.images[0]}
					alt={product.name}
					style={{ width: '300px', maxWidth: '100%', objectFit: 'cover' }}
				/>
			)}
			<h1>{product.name}</h1>
			<p>{product.description}</p>
			<p>Precio: ${product.price}</p>
			<p>Stock: {product.stock ?? 0}</p>
			{product.category && product.category.length > 0 && (
				<p>Categoría: {product.category.join(', ')}</p>
			)}
			<button
				disabled={product.stock !== undefined && product.stock <= 0}
				onClick={() =>
					dispatch({
						type: 'ADD_TO_CART',
						payload: {
							_id: product._id,
							name: product.name,
							price: product.price,
							quantity: 1,
							images: product.images
						}
					})
				}
			>
				{product.stock !== undefined && product.stock <= 0
					? 'Sin stock'
					: 'Agregar al carrito'}
			</button>
		</div>
	);
};

export default ProductDetail;
