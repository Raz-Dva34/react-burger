import type { RootState } from '@/services/store';

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.auth.isAuthChecked;

export const selectIsLoggedIn = (state: RootState): boolean => state.auth.isLoggedIn;
