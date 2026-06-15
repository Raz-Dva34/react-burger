import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredientsThunk } from './ingredients-thunks';

import type { RootState } from '@/services';
import type { TIngredient } from '@/utils/types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.items = [];
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось получить ингредиенты';
      });
  },
});

export const selectIngredients = (state: RootState): TIngredient[] =>
  state.ingredients.items;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;
