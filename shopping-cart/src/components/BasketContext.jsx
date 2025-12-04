import React, { createContext, useContext, useState } from "react";

const BasketContext = createContext();

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (!context) {
    throw new Error("useBasket must be used within a BasketProvider");
  }
  return context;
};

export const BasketProvider = ({ children }) => {
  const [basket, setBasket] = useState([]);

  const addToBasket = (vegetable) => {
    setBasket((prev) => [
      ...prev,
      { ...vegetable, id: Date.now() + Math.random() },
    ]);
  };

  const removeFromBasket = (itemId) => {
    setBasket((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const getTotalPrice = () => {
    return basket.reduce((total, item) => total + item.price, 0);
  };

  const getItemCount = () => {
    return basket.length;
  };

  const value = {
    basket,
    addToBasket,
    removeFromBasket,
    clearBasket,
    getTotalPrice,
    getItemCount,
  };

  return (
    <BasketContext.Provider value={value}>{children}</BasketContext.Provider>
  );
};
