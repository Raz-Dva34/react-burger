import type { TIngredient, TOrder, TOrderStatus } from './types';

export const getOrderStatusText = (status: TOrderStatus): string => {
  switch (status) {
    case 'created':
      return 'Создан';
    case 'pending':
      return 'Готовится';
    case 'done':
      return 'Выполнен';
  }
};

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  const ingredientsById = new Map(
    ingredients.map((ingredient) => [ingredient._id, ingredient])
  );

  return order.ingredients
    .map((ingredientId) => ingredientsById.get(ingredientId))
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
};

export const getOrderPrice = (order: TOrder, ingredients: TIngredient[]): number =>
  getOrderIngredients(order, ingredients).reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );

export const getOrderName = (order: TOrder): string => {
  const name = order.name?.trim();

  return name === undefined || name.length === 0 ? `Заказ #${order.number}` : name;
};

export const getIngredientCounts = (
  orderIngredients: TIngredient[]
): Map<string, { ingredient: TIngredient; count: number }> => {
  const counts = new Map<string, { ingredient: TIngredient; count: number }>();

  orderIngredients.forEach((ingredient) => {
    const current = counts.get(ingredient._id);

    if (current) {
      counts.set(ingredient._id, { ...current, count: current.count + 1 });
      return;
    }

    counts.set(ingredient._id, { ingredient, count: 1 });
  });

  return counts;
};
