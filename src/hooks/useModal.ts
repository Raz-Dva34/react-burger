import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';

type UseModal = {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  handleOpenModal: () => void;
  handleCloseModal: () => void;
};

export const useModal = (initialValue = false): UseModal => {
  const [visible, setVisible] = useState(initialValue);

  const handleOpenModal = useCallback((): void => {
    setVisible(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setVisible(false);
  }, []);

  return {
    visible,
    setVisible,
    handleOpenModal,
    handleCloseModal,
  };
};
