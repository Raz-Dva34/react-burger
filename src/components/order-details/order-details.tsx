import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

const orderNumber = '034536';

export const OrderDetails = (): React.JSX.Element => {
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
