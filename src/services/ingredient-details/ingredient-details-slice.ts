import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '@/services';
import type { TIngredient } from '@/utils/types';

type TIngredientDetailsState = {
  ingredient: TIngredient | null;
};

const initialState: TIngredientDetailsState = {
  ingredient: null,
};

export const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredientDetails: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredientDetails: (state) => {
      state.ingredient = null;
    },
  },
});

export const { clearIngredientDetails, setIngredientDetails } =
  ingredientDetailsSlice.actions;

export const selectIngredientDetails = (state: RootState): TIngredient | null =>
  state.ingredientDetails.ingredient;
