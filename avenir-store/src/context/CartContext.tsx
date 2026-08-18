import { createContext, useContext, useReducer, useEffect } from 'react';
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

// carga inicial desde localStorage (lazy initializer)
const getInitialState = (): CartState => {
    try {
        const stored = localStorage.getItem('cart');

        if (!stored) {
            return initialState;
        }

        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
            return { items: parsed };
        }

        return initialState;
    } catch {
        return initialState;
    }
};

//reducer

const CartReducer = (state: CartState, action: CartAction): CartState => {
    console.log('ACTION', action);
    console.log('ACTION RECIBIDA EN REDUCER', {
        type: action.type,
        stateItemsBefore: state.items
    });

    switch (action.type) {
        case 'ADD_TO_CART': 
        {
            const exists = state.items.find(
                item => item._id === action.payload._id
            );

            console.log('ADD_TO_CART - EXISTE?', Boolean(exists), exists);

            const nextState = exists
                ? {
                    items: state.items.map(item =>
                        item._id === action.payload._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                    )
                }
                : {
                    items: [...state.items, { ...action.payload, quantity: 1 }]
                };

            console.log('ADD_TO_CART - NUEVO ESTADO', nextState);
            return nextState;
        }

        case 'REMOVE_FROM_CART': {
            console.log('REMOVE_FROM_CART - STATE ANTES', state.items);
            const nextState = {
                items: state.items.filter(item => item._id !== action.payload)
            };
            console.log('REMOVE_FROM_CART - STATE DESPUÉS', nextState.items);
            return nextState;
        }

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
    const [state, dispatch] = useReducer(CartReducer, undefined, getInitialState);
    console.log("Estado del carrito:", state);
    console.log('CART STATE:', state.items);
    console.log('STATE DEL PROVIDER', state.items);

    useEffect(() => {
        try {
            localStorage.setItem('cart', JSON.stringify(state.items));
        } catch (e) {
            // ignore write errors
        }
    }, [state.items]);

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