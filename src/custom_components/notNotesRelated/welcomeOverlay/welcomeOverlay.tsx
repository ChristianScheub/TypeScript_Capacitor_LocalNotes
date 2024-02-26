import React, { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface WelcomeOverlayProps {
  closeOverlay: () => void;
}

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ closeOverlay }) => {
  const [firstScreenDone, setFirstScreenDone] = useState<Boolean>(true);
  const { t } = useTranslation();

  const closeWelcomeOverlay = () => {
    localStorage.setItem("welcomeScreenDone", "true");
    closeOverlay();
  };

  return (
    <div style={overlayStyle}>
      {firstScreenDone ? (
        <div style={congratulationAnimationStyle}>
          <h1>{t("welcomeOverlay.h1")}</h1>
          <p>{t("welcomeOverlay.p1")}</p>
          <p>{t("welcomeOverlay.p2")}</p>
          <p>
            {t("welcomeOverlay.p3")}
            <b>{t("welcomeOverlay.p3_bold")}</b>
          </p>
          <p>{t("welcomeOverlay.p4")}</p>

          <button
            style={closeButtonStyle}
            onClick={() => setFirstScreenDone(false)}
            data-testid="welcome-overlay-firstDone"
          >
            <FaArrowRight />
          </button>
        </div>
      ) : (
        <div style={congratulationAnimationStyle}>
          <h1>{t("furtherFeatures.h1")}</h1>
          <li>{t("furtherFeatures.li1")}</li>
          <br />
          <li>{t("furtherFeatures.li3")}</li>
          <br />
          <li>{t("furtherFeatures.li4")}</li>
          <br />
          <li>{t("furtherFeatures.li5")}</li>
          <br />
          <button style={closeButtonStyle} onClick={closeWelcomeOverlay} data-testid="welcome-overlay-secondDone">
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomeOverlay;

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "flex-end",
  zIndex: 1000,
};

const congratulationAnimationStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  animation: "congratulationFade 2s forwards",
};

const closeButtonStyle: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "15vh",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  border: "none",
  color: "white",
  fontSize: "24px",
  borderRadius: "50%",
  width: "60px",
  height: "60px",
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.3s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};