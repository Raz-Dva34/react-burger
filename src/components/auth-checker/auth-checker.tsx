import { setAuthStatus } from '@/services/auth/reducer';
import { useAppDispatch } from '@/services/hooks';
import { useLazyGetCurrentUserQuery } from '@/services/user/api';
import { clearTokens, getAccessToken } from '@/utils/api/auth-tokens';
import { useEffect } from 'react';

export const AuthChecker = (): null => {
  const dispatch = useAppDispatch();
  const [getCurrentUser] = useLazyGetCurrentUserQuery();
  const token = getAccessToken();

  useEffect(() => {
    if (!token) {
      dispatch(setAuthStatus({ isAuthChecked: true, isLoggedIn: false }));
      return;
    }

    void getCurrentUser()
      .unwrap()
      .then(() => {
        dispatch(setAuthStatus({ isAuthChecked: true, isLoggedIn: true }));
      })
      .catch(() => {
        clearTokens();
        dispatch(setAuthStatus({ isAuthChecked: true, isLoggedIn: false }));
      });
  }, [dispatch, getCurrentUser, token]);

  return null;
};
