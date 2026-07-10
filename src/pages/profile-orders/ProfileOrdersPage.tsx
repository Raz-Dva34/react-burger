import { OrderList } from '@/components/order-list';
import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { useGetProfileOrdersQuery } from '@/services/order/api';
import { ORDER_MODAL_STORAGE_KEY } from '@/utils/routes';
import { useEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';

import styles from './ProfileOrdersPage.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const location = useLocation();
  const orderMatch = useMatch('/profile/orders/:id');
  const isDirectOrderPage =
    Boolean(orderMatch) &&
    location.key === 'default' &&
    sessionStorage.getItem(ORDER_MODAL_STORAGE_KEY) !== location.pathname;
  const { data: ingredients = [], isLoading: isIngredientsLoading } =
    useGetIngredientsQuery(undefined, { skip: isDirectOrderPage });
  const { data: feed = { orders: [], total: 0, totalToday: 0, isReady: false } } =
    useGetProfileOrdersQuery(undefined, { skip: isDirectOrderPage });

  useEffect(() => {
    if (!orderMatch) {
      sessionStorage.removeItem(ORDER_MODAL_STORAGE_KEY);
    }
  }, [orderMatch]);

  if (isDirectOrderPage) {
    return (
      <section className={styles.page}>
        <Outlet />
      </section>
    );
  }

  return (
    <>
      <section className={styles.page}>
        <OrderList
          basePath="/profile/orders"
          ingredients={ingredients}
          isLoading={isIngredientsLoading || !feed.isReady}
          orders={feed.orders}
          showStatus
        />
      </section>

      <Outlet />
    </>
  );
};

export default ProfileOrdersPage;
