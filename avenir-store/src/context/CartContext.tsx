import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';

/* ====== TIPOS ===== */

import type { CartItem } from '../types/Cart';

interface CartState {
    items: CartItem[];
}

type CartAction =
| { type: 'ADD_TO_CART'; payload: CartItem }
| { type: 'REMOVE_FROM_CART'; payload: string }
| { type: 'CLEAR_CART' };

//estado inicial

const initialState: CartState = {
    items: []
};

//reducer

const CartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_TO_CART': 
        {
            const exists = state.items.find(
                item => item._id === action.payload._id
            );

            if (exists) {
                return {
                    items: state.items.map(item =>
                        item._id === action.payload._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    )
                };
            }

            return {
                items: [...state.items, { ...action.payload, quantity: 1 }]
            };
        }

        case 'REMOVE_FROM_CART':
            return {
                items: state.items.filter(item => item._id !== action.payload)
            };

        case 'CLEAR_CART':
            return initialState;
            
         default:
            return state;   
    }
};

// context

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

//provider

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(CartReducer, initialState);
console.log('CART STATE:', state.items);
    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

//hook

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error ('useCart debe usarse dentro de CartProvider');
    }
    return context;
};