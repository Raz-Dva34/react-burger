import { describe, expect, it } from 'vitest';

import { ingredientsSlice } from './ingredients-slice';
import { fetchIngredientsThunk } from './ingredients-thunks';

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

describe('ingredientsSlice reducer', () => {
  it('should return the initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('should handle fetch ingredients pending', () => {
    expect(
      ingredientsSlice.reducer(undefined, fetchIngredientsThunk.pending('request-id'))
    ).toEqual({
      items: [],
      isLoading: true,
      error: null,
    });
  });

  it('should handle fetch ingredients fulfilled', () => {
    expect(
      ingredientsSlice.reducer(
        { items: [], isLoading: true, error: null },
        fetchIngredientsThunk.fulfilled([ingredient], 'request-id')
      )
    ).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null,
    });
  });

  it('should handle fetch ingredients rejected', () => {
    expect(
      ingredientsSlice.reducer(
        { items: [ingredient], isLoading: true, error: null },
        fetchIngredientsThunk.rejected(new Error('Ошибка загрузки'), 'request-id')
      )
    ).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка загрузки',
    });
  });
});
