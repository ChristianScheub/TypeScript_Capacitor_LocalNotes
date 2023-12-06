import React, { useState, FormEvent } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface EncryptionKeyModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (encryptionKey: string) => void;
}

const EncryptionKeyModal: React.FC<EncryptionKeyModalProps> = ({ show, onHide, onSubmit }) => {
  const [encryptionKey, setEncryptionKey] = useState('');

  const handleKeySubmit = (event: FormEvent) => {
    event.preventDefault(); 
    onSubmit(encryptionKey);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static" keyboard={false} style={{  color: "white"}}>
      <Modal.Header style={{ backgroundColor: "#49454F", color: "white"}}>
        <Modal.Title>Verschlüsselungscode</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleKeySubmit}>
        <Modal.Body style={{ backgroundColor: "#49454F", color: "white"}}>
          <Form.Group>
            <Form.Label>Bitte gib deinen Verschlüsselungscode ein. Falls noch keiner definiert wurde kannst du einen beliebigen nehmen. Deine Notizen werden anschließend mit einer AES Verschlüsselung verschlüsselt und sind folglich nicht mehr wieder herstellbar. Merke ihn dir also gut! </Form.Label>
            <Form.Control
              type="password"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
              style={{ backgroundColor: "#1D1B20",color:"white"}}
              data-testid="password-input"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#49454F", color: "white"}}>
          <Button variant="primary" type="submit">
            Los!
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EncryptionKeyModal;