import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { hideToast } from '../JS/feature/toastSlice';

const GlobalToast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);

  useEffect(() => {
    // auto-hide after delay handled by react-bootstrap Toast via `autohide`/`delay`
    // Make sure hidden state resets message when toast closes
  }, [toast]);

  return (
    typeof document !== 'undefined' && (
      <ToastContainer position="top-end" className="p-3 position-fixed top-0 end-0">
        <Toast
          className="custom-toast"
          show={toast.show}
          bg={toast.variant}
          autohide={true}
          delay={toast.delay}
          onClose={() => dispatch(hideToast())}
        >
          <Toast.Header>
            <strong className="me-auto">{toast.variant === 'success' ? 'Succès' : 'Info'}</strong>
          </Toast.Header>
          <Toast.Body className={toast.variant === 'success' ? 'text-white' : ''}>
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    )
  );
};

export default GlobalToast;
