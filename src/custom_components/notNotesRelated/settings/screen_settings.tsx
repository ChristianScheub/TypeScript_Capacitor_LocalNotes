import { useNavigate } from "react-router-dom";
import React from "react";
import { NavigateFunction } from "react-router-dom";
import Button from "@mui/material/Button";
import { useTranslation } from 'react-i18next';


interface SettingsProps {
  showFingerprintBtn: boolean;
  onDeleteAllClick: (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ) => void;
  onDeleteBiometryClick: () => void;
  onDatenschutzClick: (navigate: NavigateFunction) => void;
  onImpressumClick: (navigate: NavigateFunction) => void;
  onExportAllClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteNotesClick: () => void;
}

const SettingsView: React.FC<SettingsProps> = ({
  showFingerprintBtn,
  onDeleteAllClick,
  onDeleteBiometryClick,
  onDatenschutzClick,
  onImpressumClick,
  onExportAllClick,
  onFileChange,
  onDeleteNotesClick,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  return (
    <div
      style={{
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      <div className="after-login-container">
        <div className="mb-3" style={{ margin: "2vw", color: "white" }}>
          <h1>{t('settings_Title')}</h1>
          <hr />

          {showFingerprintBtn && (
            <>
              <p data-testid="settings-delete-bio-login" onClick={onDeleteBiometryClick}>
              {t('settings_Deletebiometry')}
              </p>
              <hr />
            </>
          )}

          <p data-testid="delete-all-button" onClick={() => onDeleteAllClick(showFingerprintBtn, navigate)} >
          {t('settings_DeleteAllData')}
          </p>
          <hr />
          <p data-testid="settings-delete-all-Notes" onClick={() => onDeleteNotesClick()}>{t('settings_DeleteAllNotes')}</p>
          <hr />
          <p data-testid="settings-export-notes" onClick={() => onExportAllClick()}>{t('settings_ExportNotes')}</p>
          <hr />

          <p>{t('settings_ImportNotes')}</p>

          <label htmlFor="file-input" data-testid="settings-notes-import2">
            <input
              accept="*"
              id="file-input"
              multiple
              type="file"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
            <Button variant="contained" color="primary" component="span" data-testid="settings-notes-import">
            {t('settings_ImportNotesBtn')}
            </Button>
          </label>
          <hr />
          <br />
          <h1>{t('settings_Information')}</h1>
          <hr />
          <p data-testid="settings-edatenschutz" onClick={() => onDatenschutzClick(navigate)}>{t('settings_Datenschutz')}</p>
          <hr />
          <p data-testid="settings-impressum" onClick={() => onImpressumClick(navigate)}>{t('settings_Impressum')}</p>
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
