export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientWithUniqueId = TIngredient & { uniqueId: string };

export type TConstructorIngredient = TIngredient & { id: string };

export type TGetFetchSuccess<T> = {
  success: boolean;
  data: T;
};

export type TOrderStatus = 'created' | 'pending' | 'done';

export type TOrder = {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
};

export type TOrdersFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isReady: boolean;
};

export type TOrderByNumberResponse = {
  success: boolean;
  orders: TOrder[];
};
