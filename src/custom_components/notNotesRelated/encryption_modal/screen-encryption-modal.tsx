import React, { FormEvent, RefObject} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn";
import { FaInfoCircle } from "react-icons/fa";
import { PiFingerprintThin } from "react-icons/pi";


interface EncryptionKeyModalViewProps {
  handleKeySubmit: (event: FormEvent) => void;
  activateFingerprint: () => void;
  showFingerprintBtn: boolean;
  navigateToPrivacy: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const EncryptionKeyModalView: React.FC<EncryptionKeyModalViewProps> = ({
  handleKeySubmit,
  activateFingerprint,
  showFingerprintBtn,
  navigateToPrivacy,
  inputRef,
}) => {

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
        {showFingerprintBtn && (
          <FloatingBtn
            alignment={ButtonAlignment.LEFT}
            icon={PiFingerprintThin}
            onClick={() => activateFingerprint()}
          />
        )}
        <FloatingBtn
          alignment={ButtonAlignment.RIGHT}
          icon={FaInfoCircle}
          onClick={navigateToPrivacy}
        />
      </div>
    </div>
  );
};

export default EncryptionKeyModalView;
