import { selectIngredientCounts } from '@/services/burger-constructor/constructor-slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  clearIngredientDetails,
  selectIngredientDetails,
  setIngredientDetails,
} from '@/services/ingredient-details/ingredient-details-slice';
import { selectIngredients } from '@/services/ingredients/ingredients-slice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';

import { BurgerIngredientCard } from '../burger-ingredient-card/burger-ingredient-card';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

import type {
  GroupedIngredients,
  TabIngredients,
  TabsIngredients,
} from './burger-ingredients.types';
import type { TIngredient, TIngredientType } from '@/utils/types';

import styles from './burger-ingredients.module.css';

const tabsValues: TabsIngredients = [
  {
    value: 'bun',
    label: 'Булки',
  },
  {
    value: 'sauce',
    label: 'Соусы',
  },
  {
    value: 'main',
    label: 'Начинки',
  },
];

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const selectedIngredient = useAppSelector(selectIngredientDetails);

  const [activeTab, setActiveTab] = useState<TabIngredients>(tabsValues[0]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Partial<Record<TIngredientType, HTMLElement | null>>>({});

  const groupedIngredients = useMemo(
    () =>
      ingredients.reduce((acc, item) => {
        const type = item.type;
        acc[type] = acc[type] ?? [];
        acc[type]?.push(item);
        return acc;
      }, {} as GroupedIngredients),
    [ingredients]
  );

  const groupedIngredientsWithTitle = useMemo(
    () =>
      tabsValues.map(({ label, value }) => ({
        title: label,
        type: value,
        items: groupedIngredients[value] ?? [],
      })),
    [groupedIngredients]
  );

  const handleScroll = useCallback((): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerTop = container.getBoundingClientRect().top;
    const closestTab = tabsValues.reduce(
      (closest, tabItem) => {
        const section = sectionRefs.current[tabItem.value];
        if (!section) return closest;

        const distance = Math.abs(section.getBoundingClientRect().top - containerTop);
        return distance < closest.distance ? { tabItem, distance } : closest;
      },
      {
        tabItem: activeTab,
        distance: Number.POSITIVE_INFINITY,
      }
    );

    if (closestTab.tabItem.value !== activeTab.value) setActiveTab(closestTab.tabItem);
  }, [activeTab]);

  const handleTabClick = useCallback((tabItem: TabIngredients): void => {
    setActiveTab(tabItem);
    sectionRefs.current[tabItem.value]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient): void => {
      dispatch(setIngredientDetails(ingredient));
    },
    [dispatch]
  );

  const handleCloseIngredientDetails = useCallback((): void => {
    dispatch(clearIngredientDetails());
  }, [dispatch]);

  return (
    <>
      <section className={styles.burger_ingredients}>
        <nav className="mb-10">
          <ul className={styles.menu}>
            {tabsValues.map((tabEl) => (
              <li key={tabEl.value} className={styles.menu_item}>
                <Tab
                  value={tabEl.value}
                  active={activeTab.value === tabEl.value}
                  onClick={() => handleTabClick(tabEl)}
                >
                  {tabEl.label}
                </Tab>
              </li>
            ))}
          </ul>
        </nav>

        <div
          ref={scrollContainerRef}
          className={styles.ingredients_wrapper + ' custom-scroll'}
          onScroll={handleScroll}
        >
          {groupedIngredientsWithTitle.map(({ title, type, items }) => (
            <section
              key={type}
              ref={(element) => {
                sectionRefs.current[type] = element;
              }}
              className={styles.ingredient_section}
            >
              <h2 className="text text_type_main-medium mb-6">{title}</h2>

              <ul className={styles.burger_tab_content}>
                {items.map((ingredientItem) => (
                  <li key={ingredientItem._id}>
                    <BurgerIngredientCard
                      amount={ingredientCounts[ingredientItem._id] ?? 0}
                      ingredient={ingredientItem}
                      onClick={() => handleIngredientClick(ingredientItem)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      {selectedIngredient && (
        <Modal header="Детали ингредиента" onClose={handleCloseIngredientDetails}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </>
  );
};
