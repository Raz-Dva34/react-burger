import { fetchIngredients } from '@/utils/api/ingredients';
import { countBurgerIngredients, selectInitialBurgerParts } from '@/utils/burger';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    fetchIngredients()
      .then((data) => {
        setIngredients(data ?? []);
        setErrorMessage('');
        setIsAppLoading(false);
      })
      .catch((error) => {
        setIngredients([]);
        setErrorMessage(
          error instanceof Error ? error.message : 'Не удалось получить ингредиенты'
        );
        setIsAppLoading(false);
      });
  }, []);

  const initialBurgerParts = useMemo(
    () => selectInitialBurgerParts(ingredients),
    [ingredients]
  );

  const { bun: constructorBun, fillings: constructorFillings } = initialBurgerParts;

  const ingredientCounts = useMemo(
    () => countBurgerIngredients(constructorBun, constructorFillings),
    [constructorBun, constructorFillings]
  );

  return (
    <div className={styles.app}>
      {isAppLoading && <Preloader />}
      {!isAppLoading && (
        <>
          <AppHeader />
          <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
            Соберите бургер
          </h1>
          {errorMessage ? (
            <main className={`${styles.main} ${styles.message} pl-5 pr-5`}>
              <p className="text text_type_main-medium">{errorMessage}</p>
            </main>
          ) : (
            <main className={`${styles.main} pl-5 pr-5`}>
              <BurgerIngredients
                ingredients={ingredients}
                ingredientCounts={ingredientCounts}
              />
              <BurgerConstructor
                bun={constructorBun}
                ingredients={constructorFillings}
              />
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default App;
