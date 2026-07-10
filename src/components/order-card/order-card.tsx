import { getOrderName, getOrderPrice, getOrderStatusText } from '@/utils/order';
import { ORDER_MODAL_STORAGE_KEY } from '@/utils/routes';
import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link } from 'react-router-dom';

import type { TIngredient, TOrder } from '@/utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  basePath: string;
  ingredients: TIngredient[];
  order: TOrder;
  showStatus?: boolean;
};

const MAX_VISIBLE_INGREDIENTS = 6;

export const OrderCard = ({
  basePath,
  ingredients,
  order,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const orderIngredients = order.ingredients
    .map((ingredientId) =>
      ingredients.find((ingredient) => ingredient._id === ingredientId)
    )
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));

  const hiddenCount = Math.max(orderIngredients.length - MAX_VISIBLE_INGREDIENTS, 0);
  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const orderPath = `${basePath}/${order.number}`;

  const handleClick = (): void => {
    sessionStorage.setItem(ORDER_MODAL_STORAGE_KEY, orderPath);
  };

  return (
    <Link to={orderPath} className={`${styles.card} p-6`} onClick={handleClick}>
      <div className={`${styles.meta} mb-6`}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <FormattedDate
          date={new Date(order.createdAt)}
          className="text text_type_main-default text_color_inactive"
        />
      </div>

      <h2 className="text text_type_main-medium mb-6">{getOrderName(order)}</h2>

      {showStatus && (
        <p
          className={`${styles.status} ${
            order.status === 'done' ? styles.status_done : ''
          } text text_type_main-default mb-6`}
        >
          {getOrderStatusText(order.status)}
        </p>
      )}

      <div className={styles.footer}>
        <ul className={styles.preview}>
          {visibleIngredients.map((ingredient, index) => (
            <li
              key={`${ingredient._id}-${index}`}
              className={styles.preview_item}
              style={{ zIndex: visibleIngredients.length - index }}
            >
              <img
                src={ingredient.image_mobile}
                alt={ingredient.name}
                className={styles.preview_image}
              />
              {index === MAX_VISIBLE_INGREDIENTS - 1 && hiddenCount > 0 && (
                <span className={`${styles.preview_more} text text_type_main-default`}>
                  +{hiddenCount}
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className={styles.price}>
          <span className="text text_type_digits-default">
            {getOrderPrice(order, ingredients)}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
