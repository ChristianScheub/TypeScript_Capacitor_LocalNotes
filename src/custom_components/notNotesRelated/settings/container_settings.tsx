import { NavigateFunction } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import SettingsView from "./screen_settings";
import React, { useState, useEffect } from "react";
import { availableBiometric } from "../fingerprintLogic";



const SettingsContainer: React.FC = () => {
  const handleImpressumClick = (navigate: NavigateFunction) => {
    navigate("/impressum");
  };
  const handleDatenschutzClick = (navigate: NavigateFunction) => {
    navigate("/datenschutz");
  };

  const handleDeleteAllClick = async (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ): Promise<void> => {
    navigate("/");
    window.location.reload();
    localStorage.clear();
    if (showFingerprintBtn) {
      try {
        await NativeBiometric.deleteCredentials({
          server: "www.LocalNotes.com",
        });
        console.log("Credentials erfolgreich gelöscht");
      } catch (error) {
        console.error("Fehler beim Löschen der Credentials", error);
      }
    }
  };

  const handleDeleteBiometryClick = async () => {
    try {
      await NativeBiometric.deleteCredentials({
        server: "www.LocalNotes.com",
      });
      alert("Login Daten gelöscht! Sie können diese nun neu setzen!");
    } catch (error) {
      console.error("Fehler beim Löschen der Credentials", error);
    }
  };

  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  return (
    <SettingsView
      showFingerprintBtn={showFingerprintBtn}
      onDeleteAllClick={handleDeleteAllClick}
      onDeleteBiometryClick={handleDeleteBiometryClick}
      onDatenschutzClick={handleDatenschutzClick}
      onImpressumClick={handleImpressumClick}
    />
  );
};

export default SettingsContainer;
