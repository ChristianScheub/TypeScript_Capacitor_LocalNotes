import { useNavigate } from "react-router-dom";
import React from "react";
import { NavigateFunction } from "react-router-dom";

interface SettingsProps {
  showFingerprintBtn: boolean;
  onDeleteAllClick: (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ) => void;
  onDeleteBiometryClick: () => void;
  onDatenschutzClick: (navigate: NavigateFunction) => void;
  onImpressumClick: (navigate: NavigateFunction) => void;
}

const SettingsView: React.FC<SettingsProps> = ({
  showFingerprintBtn,
  onDeleteAllClick,
  onDeleteBiometryClick,
  onDatenschutzClick,
  onImpressumClick,
}) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="after-login-container">
        <div className="mb-3" style={{ margin: "2vw", color: "white" }}>
          <h1>Einstellungen</h1>
          <hr />

          {showFingerprintBtn && (
            <>
              <p onClick={onDeleteBiometryClick}>
                Biometrischer Login Passwort löschen
              </p>
              <hr />
            </>
          )}

          <p onClick={() => onDeleteAllClick(showFingerprintBtn, navigate)}>
            Alle Daten löschen
          </p>
          <hr />
          <br />
          <h1>Informationen</h1>
          <hr />
          <p onClick={() => onDatenschutzClick(navigate)}>Datenschutz</p>
          <hr />
          <p onClick={() => onImpressumClick(navigate)}>Impressum</p>
          <hr />
          <a
            href="https://github.com/ChristianScheub/TypeScript_Capacitor_LocalNotes"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <p>GitHub Repository</p>
          </a>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
