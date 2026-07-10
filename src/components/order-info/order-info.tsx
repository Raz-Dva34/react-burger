import { useGetIngredientsQuery } from '@/services/ingredient/api';
import {
  useGetFeedOrdersQuery,
  useGetOrderByNumberQuery,
  useGetProfileOrdersQuery,
} from '@/services/order/api';
import {
  getIngredientCounts,
  getOrderName,
  getOrderPrice,
  getOrderStatusText,
} from '@/utils/order';
import {
  CurrencyIcon,
  FormattedDate,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@/utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  orderNumber: string;
  source: 'feed' | 'profile';
};

export const OrderInfo = ({
  orderNumber,
  source,
}: TOrderInfoProps): React.JSX.Element => {
  const { data: ingredients = [], isLoading: isIngredientsLoading } =
    useGetIngredientsQuery();
  const { data: feedOrders } = useGetFeedOrdersQuery(undefined, {
    skip: source !== 'feed',
  });
  const { data: profileOrders } = useGetProfileOrdersQuery(undefined, {
    skip: source !== 'profile',
  });

  const socketOrders = source === 'feed' ? feedOrders?.orders : profileOrders?.orders;
  const orderFromSocket = socketOrders?.find(
    (order) => String(order.number) === orderNumber
  );
  const { data: orderFromRequest, isLoading: isOrderLoading } = useGetOrderByNumberQuery(
    orderNumber,
    {
      skip: Boolean(orderFromSocket) || !orderNumber,
    }
  );

  const order = orderFromSocket ?? orderFromRequest;

  if (isIngredientsLoading || isOrderLoading) return <Preloader />;

  if (!order) {
    return (
      <p className="text text_type_main-medium text_color_inactive">Заказ не найден</p>
    );
  }

  const orderIngredients = order.ingredients
    .map((ingredientId) =>
      ingredients.find((ingredient) => ingredient._id === ingredientId)
    )
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
  const ingredientCounts = Array.from(getIngredientCounts(orderIngredients).values());
  const totalPrice = getOrderPrice(order, ingredients);

  return (
    <div className={styles.info}>
      <p className={`${styles.number} text text_type_digits-default mb-10`}>
        #{order.number}
      </p>

      <h2 className="text text_type_main-medium mb-3">{getOrderName(order)}</h2>

      <p
        className={`${styles.status} ${
          order.status === 'done' ? styles.status_done : ''
        } text text_type_main-default mb-15`}
      >
        {getOrderStatusText(order.status)}
      </p>

      <h3 className="text text_type_main-medium mb-6">Состав:</h3>

      <div className={`${styles.ingredients} custom-scroll pr-6 mb-10`}>
        {ingredientCounts.map(({ ingredient, count }) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.image_wrapper}>
              <img
                src={ingredient.image_mobile}
                alt={ingredient.name}
                className={styles.image}
              />
            </div>

            <p className={`${styles.name} text text_type_main-default`}>
              {ingredient.name}
            </p>

            <div className={styles.price}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />

        <div className={styles.price}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderInfo;
