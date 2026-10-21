import React, { createContext, useState, useContext } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const addToCart = (item) => setCart(prev => prev.find(i => i.id === item.id) ? prev : [...prev, item]);
  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const totalPrice = cart.reduce((s, i) => s + i.price, 0);
  return <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>{children}</CartContext.Provider>;
};
export const useCart = () => useContext(CartContext);
