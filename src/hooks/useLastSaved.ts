import { useRecoilValue } from 'recoil';
import { lastSavedAtState } from '../state/productAtom';

export function useLastSaved() {
  const lastSavedAt = useRecoilValue(lastSavedAtState);
  return { lastSavedAt };
}
