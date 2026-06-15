import { DND_ITEM_TYPES } from '@/utils/dnd';
import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import type { TIngredient } from '@/utils/types';
import type React from 'react';

import styles from './burger-ingredient-card.module.css';

type TBurgerIngredientCardProps = {
  amount?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ingredient: TIngredient;
};

export const BurgerIngredientCard = ({
  amount,
  ingredient,
  onClick,
}: TBurgerIngredientCardProps): React.JSX.Element => {
  const { image, name, price } = ingredient;

  const [{ isDragging }, dragRef] = useDrag<
    { ingredient: TIngredient },
    void,
    { isDragging: boolean }
  >(
    () => ({
      type: DND_ITEM_TYPES.ingredient,
      item: { ingredient },
      collect: (monitor): { isDragging: boolean } => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  return (
    <div
      ref={(element) => {
        dragRef(element);
      }}
      className={styles.card}
      onClick={onClick}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <img src={image} alt={name} className={styles.img} />

      <div className={styles.price}>
        <span className="text text_type_digits-default">{price}</span>

        <CurrencyIcon type="primary" />
      </div>

      <div className="text text_type_main-default">{name}</div>
      {!!amount && <Counter count={amount} size="default" />}
    </div>
  );
};
