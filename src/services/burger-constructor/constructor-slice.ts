import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '@/services';
import type { TConstructorIngredient, TIngredient } from '@/utils/types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
        },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(({ id }) => id !== action.payload);
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);

      if (movedIngredient) state.ingredients.splice(toIndex, 0, movedIngredient);
    },
    clearConstructor: () => ({
      bun: null,
      ingredients: [],
    }),
  },
});

export const { addIngredient, clearConstructor, moveIngredient, removeIngredient } =
  constructorSlice.actions;

export const selectConstructorBun = (state: RootState): TIngredient | null =>
  state.burgerConstructor.bun;
export const selectConstructorIngredients = (
  state: RootState
): TConstructorIngredient[] => state.burgerConstructor.ingredients;

export const selectConstructorIngredientIds = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): string[] => {
    if (!bun) return [];

    return [bun._id, ...ingredients.map(({ _id }) => _id), bun._id];
  }
);

export const selectIngredientCounts = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): Record<string, number> => {
    const counts: Record<string, number> = {};

    if (bun) counts[bun._id] = 2;

    ingredients.forEach(({ _id }) => {
      counts[_id] = (counts[_id] ?? 0) + 1;
    });

    return counts;
  }
);

export const selectTotalPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);

    return bunPrice + ingredientsPrice;
  }
);
