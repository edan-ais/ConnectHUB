import { atom } from 'recoil';
import { Product } from '../types/product';

export const productsState = atom<Product[]>({
  key: 'productsState',
  default: [],
});

export const productsLoadingState = atom<boolean>({
  key: 'productsLoadingState',
  default: false,
});

export const productsSavingState = atom<boolean>({
  key: 'productsSavingState',
  default: false,
});

export const lastSavedAtState = atom<Date | null>({
  key: 'lastSavedAtState',
  default: null,
});
