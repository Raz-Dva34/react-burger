import { FeedStats } from '@/components/feed-stats';
import { OrderList } from '@/components/order-list';
import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { useGetFeedOrdersQuery } from '@/services/order/api';
import { ORDER_MODAL_STORAGE_KEY } from '@/utils/routes';
import { useEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';

import styles from './FeedPage.module.css';

export const FeedPage = (): React.JSX.Element => {
  const location = useLocation();
  const orderMatch = useMatch('/feed/:id');
  const isDirectOrderPage =
    Boolean(orderMatch) &&
    location.key === 'default' &&
    sessionStorage.getItem(ORDER_MODAL_STORAGE_KEY) !== location.pathname;
  const { data: ingredients = [], isLoading: isIngredientsLoading } =
    useGetIngredientsQuery(undefined, { skip: isDirectOrderPage });
  const { data: feed = { orders: [], total: 0, totalToday: 0, isReady: false } } =
    useGetFeedOrdersQuery(undefined, { skip: isDirectOrderPage });

  useEffect(() => {
    if (!orderMatch) {
      sessionStorage.removeItem(ORDER_MODAL_STORAGE_KEY);
    }
  }, [orderMatch]);

  if (isDirectOrderPage) return <Outlet />;

  return (
    <>
      <section className={styles.page}>
        <h1 className="text text_type_main-large mb-5">Лента заказов</h1>

        <div className={styles.content}>
          <OrderList
            basePath="/feed"
            ingredients={ingredients}
            isLoading={isIngredientsLoading || !feed.isReady}
            orders={feed.orders}
          />
          <FeedStats
            orders={feed.orders}
            total={feed.total}
            totalToday={feed.totalToday}
          />
        </div>
      </section>

      <Outlet />
    </>
  );
};

export default FeedPage;
