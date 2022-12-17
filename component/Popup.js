import { Button, Modal, Text } from "@nextui-org/react";
import React from "react";

function Popup({ open, setOpen, message }) {
  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={open}
      onClose={setOpen}
    >
      <Modal.Header>
        <Text id="modal-title" size={18} css={{ fontFamily: "Inter" }}>
          Transaction successful
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Text css={{ fontFamily: "Inter", ta: "center" }}>{message}</Text>
      </Modal.Body>
      <Modal.Footer>
        <Button auto color="error" onClick={setOpen}>
          Got it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Popup;
