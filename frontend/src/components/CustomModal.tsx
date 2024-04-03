import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface ModalProps {
  show: boolean;
  onHide: () => void;
  title: "Success" | "Failed" | "Details";
  titleIcon: React.ReactNode;
  content: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({
  show,
  onHide,
  title,
  titleIcon,
  content,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {title} {titleIcon}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
    </Modal>
  );
};

export default CustomModal;
