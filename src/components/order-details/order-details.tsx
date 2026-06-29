import { useAppSelector } from '@/services/hooks';
import {
  selectOrderError,
  selectOrderLoading,
  selectOrderNumber,
} from '@/services/order/order-slice';
import { CheckMarkIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const orderNumber = useAppSelector(selectOrderNumber);
  const isOrderLoading = useAppSelector(selectOrderLoading);
  const orderError = useAppSelector(selectOrderError);

  if (isOrderLoading) return <Preloader />;

  if (orderError) {
    return (
      <div className="pb-30">
        <div className="text text_type_main-medium mb-4">Не удалось оформить заказ</div>
        <div className="text text_type_main-default">{orderError}</div>
      </div>
    );
  }

  return (
    <div className="pb-30">
      <div className="text text_type_digits-large mb-8">{orderNumber}</div>
      <div className="text text_type_main-medium mb-15">идентификатор заказа</div>
      <CheckMarkIcon type="primary" className={`${styles.icon_success} mb-15`} />
      <div className="text text_type_main-default mb-2">Ваш заказ начали готовить</div>
      <div className="text text_type_main-default">
        Дождитесь готовки на орбитальной станции
      </div>
    </div>
  );
};
