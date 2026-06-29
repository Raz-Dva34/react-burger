import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  selectConstructorBun,
  selectConstructorIngredientIds,
  selectConstructorIngredients,
  selectTotalPrice,
} from '@/services/burger-constructor/constructor-slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  resetOrder,
  selectOrderError,
  selectOrderLoading,
} from '@/services/order/order-slice';
import { createOrderThunk } from '@/services/order/order-thunks';
import { DND_ITEM_TYPES } from '@/utils/dnd';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TConstructorIngredient, TIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

type TIngredientDragItem = {
  ingredient: TIngredient;
};

type TConstructorDragItem = {
  id: string;
  index: number;
  originalIndex: number;
};

type TConstructorIngredientItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
  onMove: (fromIndex: number, toIndex: number) => void;
  onRemove: (id: string) => void;
};

const ConstructorIngredientItem = ({
  ingredient,
  index,
  onMove,
  onRemove,
}: TConstructorIngredientItemProps): React.JSX.Element => {
  const itemRef = useRef<HTMLLIElement | null>(null);

  const [, dropRef] = useDrop<TConstructorDragItem>({
    accept: DND_ITEM_TYPES.constructorIngredient,
    drop: () => ({ droppedInConstructor: true }),
    hover: (dragItem, monitor) => {
      const element = itemRef.current;
      if (!element || dragItem.index === index) return;

      const hoverRect = element.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverRect.top : 0;

      if (dragItem.index < index && hoverClientY < hoverMiddleY) return;
      if (dragItem.index > index && hoverClientY > hoverMiddleY) return;

      onMove(dragItem.index, index);
      dragItem.index = index;
    },
  });

  const [{ isDragging }, dragRef] = useDrag<
    TConstructorDragItem,
    void,
    { isDragging: boolean }
  >({
    type: DND_ITEM_TYPES.constructorIngredient,
    item: { id: ingredient.id, index, originalIndex: index },
    end: (dragItem, monitor) => {
      if (!monitor.didDrop() && dragItem.index !== dragItem.originalIndex) {
        onMove(dragItem.index, dragItem.originalIndex);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  dragRef(dropRef(itemRef));

  return (
    <li
      ref={itemRef}
      className={styles.ingredients_item}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" className={styles.icon} />

      <ConstructorElement
        text={ingredient.name}
        thumbnail={ingredient.image}
        price={ingredient.price}
        handleClose={() => onRemove(ingredient.id)}
      />
    </li>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectConstructorBun);
  const ingredients = useAppSelector(selectConstructorIngredients);
  const ingredientIds = useAppSelector(selectConstructorIngredientIds);
  const isOrderLoading = useAppSelector(selectOrderLoading);
  const orderError = useAppSelector(selectOrderError);
  const totalPrice = useAppSelector(selectTotalPrice);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [{ isHover }, dropTargetRef] = useDrop<
    TIngredientDragItem,
    void,
    { isHover: boolean }
  >(
    () => ({
      accept: DND_ITEM_TYPES.ingredient,
      drop: ({ ingredient }): void => {
        dispatch(addIngredient(ingredient));
      },
      collect: (monitor): { isHover: boolean } => ({
        isHover: monitor.isOver(),
      }),
    }),
    [dispatch]
  );

  const [, sortDropTargetRef] = useDrop<TConstructorDragItem>({
    accept: DND_ITEM_TYPES.constructorIngredient,
    drop: () => ({ droppedInConstructor: true }),
  });

  const handleMoveIngredient = useCallback(
    (fromIndex: number, toIndex: number): void => {
      dispatch(moveIngredient({ fromIndex, toIndex }));
    },
    [dispatch]
  );

  const handleRemoveIngredient = useCallback(
    (id: string): void => {
      dispatch(removeIngredient(id));
    },
    [dispatch]
  );

  const handleOpenOrderModal = useCallback((): void => {
    if (!bun || ingredientIds.length === 0) return;

    dispatch(createOrderThunk(ingredientIds))
      .unwrap()
      .then(() => {
        setIsOrderModalOpen(true);
      })
      .catch(() => undefined);
  }, [bun, dispatch, ingredientIds]);

  const handleCloseOrderModal = useCallback((): void => {
    setIsOrderModalOpen(false);
    dispatch(resetOrder());
  }, [dispatch]);

  return (
    <>
      <section
        ref={(element) => {
          dropTargetRef(element);
          sortDropTargetRef(element);
        }}
        className={`${styles.burger_constructor} ${isHover ? styles.burger_constructor_hover : ''}`}
      >
        <div className={styles.ingredients_wrapper}>
          {bun ? (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                type="top"
                text={`${bun.name} (верх)`}
                thumbnail={bun.image}
                price={bun.price}
              />
            </div>
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_top} ml-8`}>
              <span className="text text_type_main-default">Перетащите булку</span>
            </div>
          )}

          {ingredients.length ? (
            <ul className={`${styles.ingredients_list} custom-scroll`}>
              {ingredients.map((ingredientItem, index) => (
                <ConstructorIngredientItem
                  key={ingredientItem.id}
                  ingredient={ingredientItem}
                  index={index}
                  onMove={handleMoveIngredient}
                  onRemove={handleRemoveIngredient}
                />
              ))}
            </ul>
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_middle} ml-8`}>
              <span className="text text_type_main-default">
                Перетащите начинку или соус
              </span>
            </div>
          )}

          {bun ? (
            <div className="pl-8">
              <ConstructorElement
                isLocked
                type="bottom"
                text={`${bun.name} (низ)`}
                thumbnail={bun.image}
                price={bun.price}
              />
            </div>
          ) : (
            <div className={`${styles.placeholder} ${styles.placeholder_bottom} ml-8`}>
              <span className="text text_type_main-default">Перетащите булку</span>
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
            disabled={!bun || !ingredients.length || isOrderLoading}
          >
            {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
          </Button>
        </div>

        {orderError && (
          <p className={`${styles.error} text text_type_main-default mt-4`}>
            {orderError}
          </p>
        )}
      </section>

      {isOrderModalOpen && (
        <Modal header="Детали заказа" onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};
