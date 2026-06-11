import type { TIngredient } from './types';

type TInitialBurgerParts = {
  bun?: TIngredient;
  fillings: TIngredient[];
};

export const selectInitialBurgerParts = (
  ingredients: TIngredient[]
): TInitialBurgerParts => {
  const bun = ingredients.find(({ type }) => type === 'bun');
  const sauces = ingredients.filter(({ type }) => type === 'sauce').slice(0, 2);
  const mains = ingredients.filter(({ type }) => type === 'main').slice(0, 4);

  return {
    bun,
    fillings: [...sauces, ...mains],
  };
};

export const countBurgerIngredients = (
  bun: TIngredient | undefined,
  fillings: TIngredient[]
): Record<string, number> => {
  const counts: Record<string, number> = {};

  if (bun) counts[bun._id] = 2;

  fillings.forEach(({ _id }) => {
    counts[_id] = (counts[_id] ?? 0) + 1;
  });

  return counts;
};

export const calculateBurgerPrice = (
  bun: TIngredient | undefined,
  fillings: TIngredient[]
): number => {
  const bunPrice = bun ? bun.price * 2 : 0;
  const fillingsPrice = fillings.reduce((sum, item) => sum + item.price, 0);

  return bunPrice + fillingsPrice;
};
