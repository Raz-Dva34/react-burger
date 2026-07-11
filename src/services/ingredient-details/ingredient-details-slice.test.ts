import { describe, expect, it } from 'vitest';

import {
  clearIngredientDetails,
  ingredientDetailsSlice,
  setIngredientDetails,
} from './ingredient-details-slice';

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

describe('ingredientDetailsSlice reducer', () => {
  it('should return the initial state', () => {
    expect(ingredientDetailsSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      ingredient: null,
    });
  });

  it('should set ingredient details', () => {
    expect(
      ingredientDetailsSlice.reducer(undefined, setIngredientDetails(ingredient))
    ).toEqual({
      ingredient,
    });
  });

  it('should clear ingredient details', () => {
    expect(
      ingredientDetailsSlice.reducer({ ingredient }, clearIngredientDetails())
    ).toEqual({
      ingredient: null,
    });
  });
});
