import React, { FormEvent, RefObject,useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn";
import { FaInfoCircle } from "react-icons/fa";
import { PiFingerprintThin } from "react-icons/pi";
import { useTranslation } from 'react-i18next';
import WelcomeOverlay from "../welcomeOverlay/welcomeOverlay";
import { FaArrowDownLong } from "react-icons/fa6";

interface EncryptionKeyModalViewProps {
  handleKeySubmit: (event: FormEvent) => void;
  activateFingerprint: () => void;
  showFingerprintBtn: boolean;
  showFingerprintHint: boolean;
  navigateToPrivacy: () => void;
  inputRef: RefObject<HTMLInputElement>;
}

const EncryptionKeyModalView: React.FC<EncryptionKeyModalViewProps> = ({
  handleKeySubmit,
  activateFingerprint,
  showFingerprintBtn,
  showFingerprintHint,
  navigateToPrivacy,
  inputRef,
}) => {
  const { t } = useTranslation();
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState<boolean | null>(
    localStorage.getItem("welcomeScreenDone") !== "true"
  );

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
      {showWelcomeOverlay && (
        <WelcomeOverlay closeOverlay={() => setShowWelcomeOverlay(false)} />
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "90vw",
          backgroundColor: "#49454F",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "4vw",
          boxSizing: "border-box",
          bottom: "35vh",
          color: "white",
          position: "fixed",
        }}
      >
        <h2>{t("encryption-modal_title")}</h2>
        <p>{t("encryption-modal_message")}</p>
        {showFingerprintBtn && <i>{t("encryption-modal_FastLoginmessage")}</i>}
        <br />
        <Form onSubmit={handleKeySubmit}>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              type="password"
              placeholder={t("encryption-modal_placeholder")}
              data-testid="password-input"
              className="white-placeholder"
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
            data-testid="password-inputBtn"
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
            {t("encryption-modal_btn")}
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
      {showFingerprintHint && (
        <div
          style={{
            textAlign: "center",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingTop:"60vh",
            color: "white"
          }}
        >
          <p style={{fontSize:"5vw"}}>
            {t("encryption-modal_hint")}
          </p>
          <FaArrowDownLong style={{fontSize: "14vw", transform: "rotate(70deg)" }} />
        </div>
      )}
    </div>
  );
};

export default EncryptionKeyModalView;
