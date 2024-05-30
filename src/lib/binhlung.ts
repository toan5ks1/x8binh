import { arrangCard } from './arrangeCard';

export const binhlung = (card: number[]) => {
  const res = arrangCard(card);
  return res.cards.reverse();
};
