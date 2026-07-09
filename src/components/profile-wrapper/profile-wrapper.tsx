import { useLogoutMutation } from '@/services/auth/api';
import { setAuthStatus } from '@/services/auth/reducer';
import { useAppDispatch } from '@/services/hooks';
import { clearTokens, getRefreshToken } from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import styles from './profile-wrapper.module.css';

export const ProfileWrapper = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const navigation = [
    {
      to: '/profile',
      label: 'Профиль',
      end: true,
    },
    {
      to: '/profile/orders',
      label: 'История заказов',
    },
  ];

  const finishLogout = (): void => {
    clearTokens();
    dispatch(setAuthStatus({ isAuthChecked: true, isLoggedIn: false }));
    void navigate('/login', { replace: true });
  };

  const handleLogout = (): void => {
    const token = getRefreshToken();
    if (!token) {
      finishLogout();
      return;
    }

    logout({ token })
      .unwrap()
      .then(() => {
        finishLogout();
      })
      .catch((error: unknown) => {
        console.error('Ошибка при выходе:', getErrorMessage(error, '502'));
      });
  };

  return (
    <div className={`${styles['profile-wrapper']} mt-20`}>
      <div>
        <div className={`${styles.links} mb-20`}>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.link} text_type_main-medium ${isActive ? styles.link_active : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <div className={`${styles.link} text_type_main-medium`} onClick={handleLogout}>
            Выход
          </div>
        </div>

        <div className="text text_type_main-default text_color_inactive">
          В этом разделе вы можете
          <br />
          изменить свои персональные данные
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default ProfileWrapper;
