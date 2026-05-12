import type { TIngredient, TIngredientType } from '@/utils/types';

export type TabIngredients = {
  label: string;
  value: TIngredientType;
};

export type GroupedIngredients = Partial<Record<TIngredientType, TIngredient[]>>;

export type TabsIngredients = TabIngredients[];
