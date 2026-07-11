import { describe, expect, it } from 'vitest';

import {
  addIngredient,
  clearConstructor,
  constructorSlice,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';

import type { TConstructorIngredient, TIngredient } from '@/utils/types';

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

const main: TIngredient = {
  ...bun,
  _id: 'main-1',
  name: 'Начинка',
  type: 'main',
  price: 50,
};

const constructorIngredient = (
  ingredient: TIngredient,
  id: string
): TConstructorIngredient => ({
  ...ingredient,
  id,
});

describe('constructorSlice reducer', () => {
  it('should return the initial state', () => {
    expect(constructorSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('should set bun when adding bun ingredient', () => {
    const state = constructorSlice.reducer(undefined, addIngredient(bun));

    expect(state.bun).toMatchObject(bun);
    expect(state.ingredients).toEqual([]);
  });

  it('should add non-bun ingredient with id', () => {
    const state = constructorSlice.reducer(undefined, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(typeof state.ingredients[0]?.id).toBe('string');
  });

  it('should remove ingredient by id', () => {
    const first = constructorIngredient(main, 'first');
    const second = constructorIngredient({ ...main, _id: 'main-2' }, 'second');

    const state = constructorSlice.reducer(
      { bun: null, ingredients: [first, second] },
      removeIngredient('first')
    );

    expect(state.ingredients).toEqual([second]);
  });

  it('should move ingredient', () => {
    const first = constructorIngredient(main, 'first');
    const second = constructorIngredient({ ...main, _id: 'main-2' }, 'second');

    const state = constructorSlice.reducer(
      { bun: null, ingredients: [first, second] },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([second, first]);
  });

  it('should clear constructor', () => {
    const state = constructorSlice.reducer(
      { bun, ingredients: [constructorIngredient(main, 'first')] },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
