import { create } from 'zustand';
import type { Game } from './games';

// Simple cart using React state since we don't have zustand
// We'll use context instead

export interface CartItem {
  game: Game;
  quantity: number;
}

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);
