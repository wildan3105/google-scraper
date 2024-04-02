// Modal.tsx
import React from "react";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode | string;
}

const Modal: React.FC<ModalProps> = ({ visible, onClose, children }) => {
  return (
    <>
      {visible && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
