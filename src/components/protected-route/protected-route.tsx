import { selectIsAuthChecked, selectIsLoggedIn } from '@/services/auth/selectors';
import { useAppSelector } from '@/services/hooks';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import type React from 'react';

type ProtectedRouteProps = {
  children?: React.ReactNode;
  anonymous?: boolean;
};

export const ProtectedRoute = ({
  children,
  anonymous = false,
}: ProtectedRouteProps): React.JSX.Element => {
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from ?? '/';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};
