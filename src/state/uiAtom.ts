import { atom } from 'recoil';
import type { SheetTabKey } from '../App';

export const activeTabState = atom<SheetTabKey>({
  key: 'activeTabState',
  default: 'main',
});
