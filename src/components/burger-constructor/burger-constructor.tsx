import { calculateBurgerPrice } from '@/utils/burger';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useState } from 'react';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun?: TIngredient;
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  bun,
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const totalPrice = useMemo(
    () => calculateBurgerPrice(bun, ingredients),
    [bun, ingredients]
  );

  const handleOpenOrderModal = useCallback((): void => {
    setIsOrderModalOpen(true);
  }, []);

  const handleCloseOrderModal = useCallback((): void => {
    setIsOrderModalOpen(false);
  }, []);

  return (
    <>
      <section className={styles.burger_constructor}>
        <div className={styles.ingredients_wrapper}>
          {bun && (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                type="top"
                text={`${bun.name} (верх)`}
                thumbnail={bun.image}
                price={bun.price}
              />
            </div>
          )}

          <ul className={`${styles.ingredients_list} custom-scroll`}>
            {ingredients.map((ingredientItem) => (
              <li key={ingredientItem._id} className={styles.ingredients_item}>
                <DragIcon type="primary" className={styles.icon} />

                <ConstructorElement
                  text={ingredientItem.name}
                  thumbnail={ingredientItem.image}
                  price={ingredientItem.price}
                />
              </li>
            ))}
          </ul>

          {bun && (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                type="bottom"
                text={`${bun.name} (низ)`}
                thumbnail={bun.image}
                price={bun.price}
              />
            </div>
          )}
        </div>

        <div className={styles.order_wrapper}>
          <div className={styles.price}>
            <span className="text text_type_digits-medium pr-2">{totalPrice}</span>
            <CurrencyIcon type="primary" />
          </div>

          <Button
            htmlType="button"
            onClick={handleOpenOrderModal}
            size="large"
            type="primary"
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {isOrderModalOpen && (
        <Modal header="Детали заказа" onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
