import React, { createContext, useContext, useState, useCallback } from "react";
import type { Game } from "@/data/games";
import type { CartItem } from "@/data/cart";
import { getCartTotal } from "@/data/cart";

interface CartContextType {
  items: CartItem[];
  addToCart: (game: Game) => void;
  removeFromCart: (gameId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((game: Game) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.game.id === game.id);
      if (existing) return prev;
      return [...prev, { game, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((gameId: string) => {
    setItems((prev) => prev.filter((item) => item.game.id !== gameId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.length;
  const totalPrice = getCartTotal(items);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
