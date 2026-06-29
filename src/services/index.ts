import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from './burger-constructor/constructor-slice';
import { ingredientDetailsSlice } from './ingredient-details/ingredient-details-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderSlice } from './order/order-slice';

const rootReducer = combineSlices(
  constructorSlice,
  ingredientDetailsSlice,
  ingredientsSlice,
  orderSlice
);

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
