import React, { createContext, useReducer, useContext } from "react";

// Create the context
const CartContext = createContext();

// Define the initial state
const initialState = {
  items: [],
};

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const total = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);

      return { ...state, items: updatedItems, total, itemCount };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const total = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);

      return { ...state, items: updatedItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );

      const total = updatedItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      const itemCount = updatedItems.reduce((sum, i) => sum + i.quantity, 0);

      return { ...state, items: updatedItems, total, itemCount };
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };

    default:
      return state;
  }
};

// Create the Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
