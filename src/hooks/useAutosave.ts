import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { productsState } from '../state/productAtom';
import { debounce } from '../lib/utils/debounce';

// Placeholder hook if you later want to implement bulk autosave.
// Right now it just logs changes after a debounce.
export function useAutosave() {
  const products = useRecoilValue(productsState);

  useEffect(() => {
    const save = debounce(() => {
      console.debug('Autosave snapshot', products.length, 'products');
      // hook: send snapshot somewhere if you want global autosave
    }, 2000);

    save();
  }, [products]);
}
