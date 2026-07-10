import type { TOrder } from '@/utils/types';

import styles from './feed-stats.module.css';

type TFeedStatsProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const MAX_ROWS = 10;

const splitOrdersIntoColumns = (orders: TOrder[]): TOrder[][] => {
  const columns: TOrder[][] = [];

  for (let index = 0; index < orders.length; index += MAX_ROWS) {
    const column = orders.slice(index, index + MAX_ROWS);

    if (column.length) {
      columns.push(column);
    }
  }

  return columns;
};

export const FeedStats = ({
  orders,
  total,
  totalToday,
}: TFeedStatsProps): React.JSX.Element => {
  const doneColumns = splitOrdersIntoColumns(
    orders.filter((order) => order.status === 'done')
  );
  const pendingColumns = splitOrdersIntoColumns(
    orders.filter((order) => order.status === 'pending' || order.status === 'created')
  );

  return (
    <section className={styles.stats}>
      <div className={`${styles.status_board} mb-15`}>
        <div>
          <h2 className="text text_type_main-medium mb-6">Готово:</h2>
          <div className={styles.columns}>
            {doneColumns.map((column, index) => (
              <ul key={index} className={styles.column}>
                {column.map((order) => (
                  <li
                    key={order._id}
                    className={`${styles.done} text text_type_digits-default mb-2`}
                  >
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text text_type_main-medium mb-6">В работе:</h2>
          <div className={styles.columns}>
            {pendingColumns.map((column, index) => (
              <ul key={index} className={styles.column}>
                {column.map((order) => (
                  <li key={order._id} className="text text_type_digits-default mb-2">
                    {order.number}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-15">
        <h2 className="text text_type_main-medium">Выполнено за всё время:</h2>
        <p className={`${styles.total} text text_type_digits-large`}>{total}</p>
      </div>

      <div>
        <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
        <p className={`${styles.total} text text_type_digits-large`}>{totalToday}</p>
      </div>
    </section>
  );
};

export default FeedStats;
