import { getAccessToken, refreshToken } from '@/utils/api/auth-tokens';
import { baseQueryWithReauth } from '@/utils/api/base-query-with-auth';
import { createApi } from '@reduxjs/toolkit/query/react';

import type {
  TOrder,
  TOrderByNumberResponse,
  TOrdersFeed,
  TOrderStatus,
} from '@/utils/types';

type TCreateOrderResponse = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
};

type TCreateOrderRequest = {
  ingredients: string[];
};

type TOrdersErrorMessage = {
  message: string;
};

const emptyOrdersFeed: TOrdersFeed = {
  orders: [],
  total: 0,
  totalToday: 0,
  isReady: false,
};

const WS_BASE_URL = 'wss://new-stellarburgers.education-services.ru/orders';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOrderStatus = (status: unknown): status is TOrderStatus =>
  status === 'created' || status === 'pending' || status === 'done';

const isOrder = (value: unknown): value is TOrder => {
  if (!isObject(value)) return false;

  return (
    typeof value._id === 'string' &&
    Array.isArray(value.ingredients) &&
    value.ingredients.every((ingredient) => typeof ingredient === 'string') &&
    isOrderStatus(value.status) &&
    typeof value.number === 'number' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    (value.name === undefined || typeof value.name === 'string')
  );
};

const parseOrdersFeed = (message: string): TOrdersFeed | TOrdersErrorMessage | null => {
  try {
    const data: unknown = JSON.parse(message);

    if (!isObject(data)) return null;

    if (typeof data.message === 'string') {
      return { message: data.message };
    }

    if (
      data.success !== true ||
      !Array.isArray(data.orders) ||
      typeof data.total !== 'number' ||
      typeof data.totalToday !== 'number'
    ) {
      return null;
    }

    return {
      orders: data.orders.filter(isOrder),
      total: data.total,
      totalToday: data.totalToday,
      isReady: true,
    };
  } catch {
    return null;
  }
};

const getAccessTokenForSocket = (): string | null => {
  const token = getAccessToken();
  return token ? token.replace(/^Bearer\s+/i, '') : null;
};

const closeSocket = (socket: WebSocket | null): void => {
  if (socket === null) return;

  socket.close();
};

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createOrder: builder.mutation<TCreateOrderResponse, TCreateOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
    }),
    getOrderByNumber: builder.query<TOrder | null, string | number>({
      query: (orderNumber) => ({
        url: `/orders/${orderNumber}`,
      }),
      transformResponse: (response: TOrderByNumberResponse): TOrder | null =>
        response.orders.find(isOrder) ?? null,
    }),
    getFeedOrders: builder.query<TOrdersFeed, void>({
      queryFn: () => ({ data: { ...emptyOrdersFeed } }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(_arg, lifecycleApi) {
        await lifecycleApi.cacheDataLoaded;

        const socket = new WebSocket(`${WS_BASE_URL}/all`);

        socket.addEventListener('message', (event) => {
          const message = typeof event.data === 'string' ? event.data : '';
          const feed = parseOrdersFeed(message);

          if (!feed || 'message' in feed) return;

          lifecycleApi.updateCachedData((draft) => {
            draft.orders = feed.orders;
            draft.total = feed.total;
            draft.totalToday = feed.totalToday;
            draft.isReady = true;
          });
        });

        await lifecycleApi.cacheEntryRemoved;
        socket.close();
      },
    }),
    getProfileOrders: builder.query<TOrdersFeed, void>({
      queryFn: () => ({ data: { ...emptyOrdersFeed } }),
      keepUnusedDataFor: 0,
      async onCacheEntryAdded(_arg, lifecycleApi) {
        await lifecycleApi.cacheDataLoaded;

        let socket: WebSocket | null = null;
        let isCacheRemoved = false;

        const openSocket = (): void => {
          const token = getAccessTokenForSocket();
          if (!token || isCacheRemoved) return;

          socket = new WebSocket(`${WS_BASE_URL}?token=${token}`);

          socket.addEventListener('message', (event) => {
            const message = typeof event.data === 'string' ? event.data : '';
            const feed = parseOrdersFeed(message);

            if (!feed) return;

            if ('message' in feed) {
              if (feed.message === 'Invalid or missing token') {
                socket?.close();
                void refreshToken().then((refreshed) => {
                  if (refreshed && !isCacheRemoved) {
                    openSocket();
                  }
                });
              }
              return;
            }

            lifecycleApi.updateCachedData((draft) => {
              draft.orders = feed.orders;
              draft.total = feed.total;
              draft.totalToday = feed.totalToday;
              draft.isReady = true;
            });
          });
        };

        openSocket();

        await lifecycleApi.cacheEntryRemoved;
        isCacheRemoved = true;
        closeSocket(socket);
      },
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetFeedOrdersQuery,
  useGetOrderByNumberQuery,
  useGetProfileOrdersQuery,
} = orderApi;
