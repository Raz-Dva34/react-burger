import { OrderCard } from '@/components/order-card';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient, TOrder } from '@/utils/types';

import styles from './order-list.module.css';

type TOrderListProps = {
  basePath: string;
  ingredients: TIngredient[];
  isLoading?: boolean;
  orders: TOrder[];
  showStatus?: boolean;
};

export const OrderList = ({
  basePath,
  ingredients,
  isLoading = false,
  orders,
  showStatus = false,
}: TOrderListProps): React.JSX.Element => {
  if (isLoading) return <Preloader />;

  if (!orders.length) {
    return (
      <p className="text text_type_main-default text_color_inactive">
        Заказы пока не найдены
      </p>
    );
  }

  return (
    <div className={`${styles.list} custom-scroll pr-2`}>
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          basePath={basePath}
          ingredients={ingredients}
          order={order}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
};

export default OrderList;
