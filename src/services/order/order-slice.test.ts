import { describe, expect, it } from 'vitest';

import { orderSlice, resetOrder } from './order-slice';
import { createOrderThunk } from './order-thunks';

describe('orderSlice reducer', () => {
  it('should return the initial state', () => {
    expect(orderSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('should reset order', () => {
    expect(
      orderSlice.reducer(
        { number: 123, isLoading: false, error: 'Ошибка' },
        resetOrder()
      )
    ).toEqual({
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('should handle create order pending', () => {
    expect(
      orderSlice.reducer(undefined, createOrderThunk.pending('request-id', []))
    ).toEqual({
      number: null,
      isLoading: true,
      error: null,
    });
  });

  it('should handle create order fulfilled', () => {
    expect(
      orderSlice.reducer(
        { number: null, isLoading: true, error: null },
        createOrderThunk.fulfilled(
          { name: 'Заказ', order: { number: 123 }, success: true },
          'request-id',
          []
        )
      )
    ).toEqual({
      number: 123,
      isLoading: false,
      error: null,
    });
  });

  it('should handle create order rejected', () => {
    expect(
      orderSlice.reducer(
        { number: 123, isLoading: true, error: null },
        createOrderThunk.rejected(new Error('Ошибка заказа'), 'request-id', [])
      )
    ).toEqual({
      number: null,
      isLoading: false,
      error: 'Ошибка заказа',
    });
  });
});
