import { createSlice } from '@reduxjs/toolkit';

import { createOrderThunk } from './order-thunks';

import type { RootState } from '@/services';

type TOrderState = {
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.number = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.number = action.payload.order.number;
        state.isLoading = false;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.number = null;
        state.isLoading = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export const selectOrderNumber = (state: RootState): number | null => state.order.number;
export const selectOrderLoading = (state: RootState): boolean => state.order.isLoading;
export const selectOrderError = (state: RootState): string | null => state.order.error;
