import React, { FormEvent, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingBtn, { ButtonAlignment } from "../../modules/ui/floatingBtn";
import { FaInfoCircle } from "react-icons/fa";
import { PiFingerprintThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { getPasswordFromFingerprint,storePasswordFromFingerprint } from "./fingerprintLogic";

interface EncryptionKeyModalProps {
  onSubmit: (encryptionKey: string) => void;
}

const EncryptionKeyModal: React.FC<EncryptionKeyModalProps> = ({
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleKeySubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(inputRef.current!.value);
  };

  const activateFingerprint = async () => {
    if (inputRef.current === null) {
      console.error("inputRef.current ist null");
      return;
    }
    
    getPasswordFromFingerprint(
      "www.LocalNotes.com",
      () => {
        storePasswordFromFingerprint(
          inputRef.current?.value || "",
          () => {
            alert("Passwort gespeichert!");
            onSubmit(inputRef.current!.value );
          },
          (errorMessage) => {
            alert(errorMessage);
          }
        );
      },
      (password) => {
        console.log("Passwort erfolgreich abgerufen:", password);
        inputRef.current!.value = password;
        onSubmit(password);
      },
      (errorMessage) => {
        console.error("Fehler aufgetreten:", errorMessage);
        alert(errorMessage);
      }
    );
    
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1E1E1E",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "90vw",
          backgroundColor: "#49454F",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "4vw",
          boxSizing: "border-box",
          bottom: "30vhw",
          color: "white",
          position: "fixed",
        }}
      >
        <h2>Passwort eingeben</h2>
        <p>
          Bitte gib deinen Verschlüsselungscode ein! Deine Notizen werden
          anschließend mit einer AES Verschlüsselung verschlüsselt und sind
          folglich nicht mehr wieder herstellbar. Merke ihn dir also gut!
        </p>
        <Form onSubmit={handleKeySubmit}>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              type="password"
              placeholder="Password"
              data-testid="password-input"
              required
              style={{
                borderRadius: "10px",
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "1px solid #ddd",
              }}
            />
          </Form.Group>
          <br />
          <Button
            onClick={handleKeySubmit}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#2BCCBD",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Weiter
          </Button>

          <br />
        </Form>
        <FloatingBtn
          alignment={ButtonAlignment.LEFT}
          icon={PiFingerprintThin}
          onClick={() => activateFingerprint()}
        />

        <FloatingBtn
          alignment={ButtonAlignment.RIGHT}
          icon={FaInfoCircle}
          onClick={() => navigate("/datenschutz")}
        />
      </div>
    </div>
  );
};

export default EncryptionKeyModal;
