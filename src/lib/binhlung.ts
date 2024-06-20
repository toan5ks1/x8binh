import { arrangCard } from './arrangeCard';

export const binhlung = (card: number[]) => {
  const res = arrangCard(card);
  const chi1 = res.cards.slice(0, 5);
  const chi2 = res.cards.slice(5, 10);
  const chi3 = res.cards.slice(10, 13);

  return [...chi2, ...chi1, ...chi3];
};
