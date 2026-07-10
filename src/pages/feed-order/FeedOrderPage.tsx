import { Modal } from '@/components/modal';
import { OrderInfo } from '@/components/order-info';
import { ORDER_MODAL_STORAGE_KEY } from '@/utils/routes';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const FeedOrderPage = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  if (!id) return null;

  const orderPath = `/feed/${id}`;
  const isNewPage = location.key === 'default';
  const isSavedModal = sessionStorage.getItem(ORDER_MODAL_STORAGE_KEY) === orderPath;

  const handleClose = (): void => {
    sessionStorage.removeItem(ORDER_MODAL_STORAGE_KEY);
    void navigate('/feed');
  };

  if (isNewPage && !isSavedModal) {
    return (
      <section style={{ maxWidth: '640px', margin: '120px auto 0' }}>
        <OrderInfo orderNumber={id} source="feed" />
      </section>
    );
  }

  return (
    <Modal header="Информация о заказе" onClose={handleClose}>
      <OrderInfo orderNumber={id} source="feed" />
    </Modal>
  );
};

export default FeedOrderPage;
