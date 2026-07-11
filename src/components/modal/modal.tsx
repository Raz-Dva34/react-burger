import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '../modal-overlay';

import styles from './modal.module.css';

type ModalProps = {
  onClose: () => void;
  header?: string;
  children: React.ReactNode;
};

export const Modal = ({ children, header, onClose }: ModalProps): React.JSX.Element => {
  const modalRoot = document.getElementById('react-modals');
  if (!modalRoot) throw new Error('Modal root not found');

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      event.key === 'Escape' && onClose();
    }

    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />

      <div className={styles.modal} data-testid="modal">
        <div className={styles.modal_wrapper + ` ${header ? 'pt-10' : 'pt-30'}`}>
          {header && <h3 className="text text_type_main-large pl-10 pr-10">{header}</h3>}

          <button
            aria-label="Закрыть"
            className={styles.close_button}
            data-testid="modal-close-button"
            onClick={onClose}
            type="button"
          >
            <CloseIcon type="primary" />
          </button>

          <div className={styles.modal_content}>{children}</div>
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
