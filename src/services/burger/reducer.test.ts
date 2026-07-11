import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  burgerSlice,
  removeIngredient,
  reorderIngredients,
  resetBurger,
  setBun,
} from './reducer';

import type { TIngredient, TIngredientWithUniqueId } from '@/utils/types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Булка',
  type: 'bun',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  __v: 0,
};

const ingredient: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  price: 50,
};

const ingredientWithUniqueId = (
  item: TIngredient,
  uniqueId: string
): TIngredientWithUniqueId => ({
  ...item,
  uniqueId,
});

describe('burgerSlice reducer', () => {
  it('should return the initial state', () => {
    expect(burgerSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('should reset burger', () => {
    const state = {
      bun,
      ingredients: [ingredientWithUniqueId(ingredient, 'first')],
    };

    expect(burgerSlice.reducer(state, resetBurger())).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('should set bun', () => {
    expect(burgerSlice.reducer(undefined, setBun(bun)).bun).toEqual(bun);
  });

  it('should add ingredient with unique id', () => {
    const state = burgerSlice.reducer(undefined, addIngredient(ingredient));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(ingredient);
    expect(typeof state.ingredients[0]?.uniqueId).toBe('string');
  });

  it('should remove ingredient by unique id', () => {
    const first = ingredientWithUniqueId(ingredient, 'first');
    const second = ingredientWithUniqueId({ ...ingredient, _id: 'main-2' }, 'second');

    const state = burgerSlice.reducer(
      { bun: null, ingredients: [first, second] },
      removeIngredient('first')
    );

    expect(state.ingredients).toEqual([second]);
  });

  it('should reorder ingredients', () => {
    const first = ingredientWithUniqueId(ingredient, 'first');
    const second = ingredientWithUniqueId({ ...ingredient, _id: 'main-2' }, 'second');

    const state = burgerSlice.reducer(
      { bun: null, ingredients: [first, second] },
      reorderIngredients({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([second, first]);
  });
});
