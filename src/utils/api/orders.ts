import { API_BASE_URL } from '../constants';
import { getErrorMessage } from '../getErrorMessage';

import type { TOrderResponse } from '../types';

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok)
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);

    const result = (await response.json()) as TOrderResponse;

    if (!result.success) throw new Error('API request failed');

    return result;
  } catch (err) {
    throw new Error(getErrorMessage(err, 'Не удалось оформить заказ'));
  }
};
