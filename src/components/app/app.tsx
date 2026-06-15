import { useAppDispatch, useAppSelector } from '@/services/hooks';
import {
  selectIngredientsError,
  selectIngredientsLoading,
} from '@/services/ingredients/ingredients-slice';
import { fetchIngredientsThunk } from '@/services/ingredients/ingredients-thunks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const isAppLoading = useAppSelector(selectIngredientsLoading);
  const errorMessage = useAppSelector(selectIngredientsError);

  useEffect(() => {
    void dispatch(fetchIngredientsThunk());
  }, [dispatch]);

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
              <BurgerIngredients />
              <BurgerConstructor />
            </main>
          )}
        </>
      )}
    </div>
  );
};

export default App;
