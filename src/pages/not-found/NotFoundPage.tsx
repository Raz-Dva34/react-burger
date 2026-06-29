import { Link } from 'react-router-dom';

import styles from './NotFoundPage.module.css';

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className={styles.page}>
      <p className="text text_type_digits-large">404</p>
      <h1 className="text text_type_main-large mt-6 mb-4">Страница не найдена</h1>
      <p className="text text_type_main-default text_color_inactive mb-8">
        Возможно, адрес был изменён или такой страницы больше нет.
      </p>
      <Link to="/" className={`${styles.link} text text_type_main-default`}>
        Вернуться
      </Link>
    </section>
  );
};

export default NotFoundPage;
