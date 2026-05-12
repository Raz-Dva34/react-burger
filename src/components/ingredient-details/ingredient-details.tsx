import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

type IngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: IngredientDetailsProps): React.JSX.Element => {
  const { name, calories, proteins, carbohydrates, fat, image } = ingredient;

  const energyValueList: {
    label: string;
    value: number;
  }[] = [
    {
      label: 'Калории, ккал',
      value: calories,
    },
    {
      label: 'Белки, г',
      value: proteins,
    },
    {
      label: 'Жиры, г',
      value: fat,
    },
    {
      label: 'Углеводы, г',
      value: carbohydrates,
    },
  ];

  return (
    <div className="pb-15">
      <img src={image} alt={name} className={styles.image + ' mb-4'} />

      <div className="text text_type_main-medium mb-8">{name}</div>

      <ul className={styles.list}>
        {energyValueList.map(({ label, value }) => (
          <li key={label}>
            <div className="text text_type_main-default">{label}</div>
            <div className="text text_type_digits-default">{value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
