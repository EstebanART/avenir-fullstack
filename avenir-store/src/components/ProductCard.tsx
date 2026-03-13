import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';

interface Props {
    product: Product;
}

const ProductCard = ({ product }: Props) => {
    const { dispatch } = useCart();

    const handleAddToCart = () => {
        
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                _id: product._id,
                name: product.name,
                price: product.price,
                quantity: 1
            }
        });
    };


    return (
        <div
        style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
        }}
        >
        {/* Imagen */}
        {product.images?.[0] && (
            <img
            src={product.images[0]}
            alt={product.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
        )}

        {/* Nombre */}
        <h3>{product.name}</h3>

        {/* Precio */}
        <p>${product.price}</p>

        {/* Stock */}
        {product.stock > 0 ? (
            <button onClick={handleAddToCart}>
                Agregar al carrito
            </button>
        ) : (
            <p style={{ color: 'red' }}>Sin stock</p>
        )}
        </div>
    );
};

export default ProductCard;