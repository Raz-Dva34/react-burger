import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { useGetIngredientsQuery } from '@/services/ingredient/api';
import { setSelectedIngredient } from '@/services/selectedIngredient/reducer';
import { getSelectedIngredient } from '@/services/selectedIngredient/selectors';
import { INGREDIENT_MODAL_STORAGE_KEY } from '@/utils/routes';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details';
import { Modal } from '@components/modal';

export const IngredientPage = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isNewPage = location.key === 'default';
  const isSavedModal = sessionStorage.getItem(INGREDIENT_MODAL_STORAGE_KEY) === id;

  const dispatch = useAppDispatch();
  const selectedIngredient = useAppSelector(getSelectedIngredient);
  const { data: ingredients = [], isLoading } = useGetIngredientsQuery();

  const ingredient =
    selectedIngredient?._id === id
      ? selectedIngredient
      : ingredients.find((item) => item._id === id);

  useEffect(() => {
    if (ingredient && id) {
      dispatch(setSelectedIngredient(ingredient));
    }
  }, [id, ingredient, dispatch]);

  useEffect(() => {
    if (!isLoading && id && ingredients.length > 0 && !ingredient) {
      void navigate('/', { replace: true });
    }
  }, [isLoading, id, ingredients.length, ingredient, navigate]);

  const handleClose = (): void => {
    sessionStorage.removeItem(INGREDIENT_MODAL_STORAGE_KEY);
    if (!isNewPage) {
      void navigate(-1);
    } else {
      void navigate('/');
    }
  };

  if (!id) return null;
  if (isLoading) return <Preloader />;
  if (!ingredient) return null;

  if (isNewPage && !isSavedModal) {
    return (
      <main style={{ maxWidth: '720px', margin: '120px auto 0', textAlign: 'center' }}>
        <h1 className="text text_type_main-large mb-8">Детали ингредиента</h1>
        <IngredientDetails />
      </main>
    );
  }

  return (
    <Modal header="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};

export default IngredientPage;
