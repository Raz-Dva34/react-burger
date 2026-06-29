import { FormProfileWrapper } from '@/components/form-profile-wrapper';
import { useRegisterMutation } from '@/services/auth/api';
import { setAuthStatus } from '@/services/auth/reducer';
import { useAppDispatch } from '@/services/hooks';
import { setTokens } from '@/utils/api/auth-tokens';
import { getErrorMessage } from '@/utils/helpers/getErrorMessage';
import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { type ChangeEvent, useState } from 'react';

export const RegisterPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [register] = useRegisterMutation();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (name: keyof typeof formState) => {
    return (event: ChangeEvent<HTMLInputElement>): void => {
      setFormState({ ...formState, [name]: event.target.value });
    };
  };

  const handleSubmit = (): void => {
    register({
      name: formState.name,
      email: formState.email,
      password: formState.password,
    })
      .unwrap()
      .then((res) => {
        setTokens(res.accessToken, res.refreshToken);
        dispatch(setAuthStatus({ isAuthChecked: true, isLoggedIn: true }));
      })
      .catch((error: unknown) => {
        console.error('Ошибка при регистрации:', getErrorMessage(error, '502'));
      });
  };

  return (
    <FormProfileWrapper
      buttonText="Зарегистрироваться"
      title="Регистрация"
      onSubmit={handleSubmit}
      bottomLinks={[
        {
          text: 'Уже зарегистрированы?',
          link: { to: '/login', label: 'Войти' },
        },
      ]}
    >
      <Input
        name="name"
        value={formState.name}
        onChange={handleChange('name')}
        placeholder="Имя"
      />

      <EmailInput
        name="email"
        value={formState.email}
        onChange={handleChange('email')}
        placeholder="E-mail"
      />

      <PasswordInput
        icon="ShowIcon"
        name="password"
        value={formState.password}
        onChange={handleChange('password')}
      />
    </FormProfileWrapper>
  );
};

export default RegisterPage;
