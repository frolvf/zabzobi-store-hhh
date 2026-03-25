import type { Game } from './games';

export interface CartItem {
  game: Game;
  quantity: number;
}

export const getCartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.game.price * item.quantity, 0);
