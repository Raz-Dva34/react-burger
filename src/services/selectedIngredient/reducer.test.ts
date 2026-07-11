import { describe, expect, it } from 'vitest';

import { selectedIngredientSlice, setSelectedIngredient } from './reducer';

import type { TIngredient } from '@/utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Ингредиент',
  type: 'main',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 4,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png',
  __v: 0,
};

describe('selectedIngredientSlice reducer', () => {
  it('should return the initial state', () => {
    expect(selectedIngredientSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      ingredient: null,
    });
  });

  it('should set selected ingredient', () => {
    expect(
      selectedIngredientSlice.reducer(undefined, setSelectedIngredient(ingredient))
    ).toEqual({
      ingredient,
    });
  });
});
