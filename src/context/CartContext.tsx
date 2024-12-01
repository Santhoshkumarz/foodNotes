'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
  mealType?: string;
}

interface CartContextType {
  selectedFoods: Food[];
  addFood: (food: Food) => void;
  removeFood: (foodId: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

  const addFood = (food: Food) => {
    setSelectedFoods((prevFoods) => [...prevFoods, food]);
  };

  const removeFood = (foodId: number) => {
    setSelectedFoods((prevFoods) => prevFoods.filter((food) => food.id !== foodId));
  };

  const clearCart = () => {
    setSelectedFoods([]);
  };

  return (
    <CartContext.Provider value={{ selectedFoods, addFood, removeFood, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
