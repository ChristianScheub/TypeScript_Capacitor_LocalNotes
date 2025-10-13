import { NavigateFunction } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import SettingsView from "./screen_settings";
import React, { useState, useEffect } from "react";
import { availableBiometric } from "../fingerprintLogic";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { useLocation } from "react-router-dom";
import { Share } from "@capacitor/share";

import {
  makeReadyForExport,
  makeReadyForImport,
} from "../../handleNotes/encryptionEngine";
import { useTranslation } from "react-i18next";

const SettingsContainer: React.FC = () => {
  const { t } = useTranslation();

  const handleImpressumClick = (navigate: NavigateFunction) => {
    if (isAlreadyLoggedIn) {
      navigate("/impressum");
    } else {
      navigate("/impressumHome");
    }
  };
  const handleDatenschutzClick = (navigate: NavigateFunction) => {
    if (isAlreadyLoggedIn) {
      navigate("/datenschutz");
    } else {
      navigate("/datenschutzHome");
    }
  };

  const location = useLocation();
  const isAlreadyLoggedIn = !location.pathname.includes("settingsHome");

  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleDeleteAllClick = async (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ): Promise<void> => {
    if (window.confirm(t("settings_Dialog_DeleteAll"))) {
      localStorage.clear();
      if (showFingerprintBtn) {
        try {
          await NativeBiometric.deleteCredentials({
            server: "www.LocalNotes.com",
          });
        } catch (error) {
          //console.log("Fehler beim Löschen der Credentials", error);
        }
      }
      navigate("/");
      window.location.reload();
      alert(t("settings_Dialog_DeleteAllSuccessful"));
    }
  };

  const handleDeleteNotesClick = async (): Promise<void> => {
    if (window.confirm(t("settings_Dialog_DeleteNotes"))) {
      localStorage.clear();
      alert(t("settings_Dialog_DeleteNotesSuccessful"));
    }
  };

  const handleDeleteBiometryClick = async () => {
    if (window.confirm(t("settings_Dialog_DeleteBio"))) {
      try {
        await NativeBiometric.deleteCredentials({
          server: "www.LocalNotes.com",
        });
        alert(t("settings_Dialog_DeleteBioSuccessful"));
      } catch (error) {
        console.error("Error at delete Credentials", error);
        alert(t("settings_Dialog_DeleteBioError"));
      }
    }
  };

  const generateFileName = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `notes-${year}${month}${day}-${hours}${minutes}${seconds}.txt`;
  };

  const handleExportAllClick = async () => {
    let notes = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        const item = localStorage.getItem(key);
        if (item !== null) {
          const value = await makeReadyForExport(item);
          notes += ` ${key}*_*_* ${value}*_*_*`;
        }
      }
    }

    try {
      const fileName = generateFileName();
      const base64Data = btoa(notes);

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      try {
        const uriResult = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName,
        });

        await Share.share({
          url: uriResult.uri,
        });
      } catch (shareError) {
        downloadFile(notes, fileName);
      }
    } catch (e) {
      console.error("Error during export or sharing", e);
    }
  };

  const downloadFile = (base64Data: string, fileName: string) => {
    const blob = new Blob([base64Data], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (window.confirm(t("settings_Dialog_Import"))) {
      if (file) {
        const fileContent = await readFileContent(file);
        if (fileContent) {
          const lines = fileContent.trim().split("*_*_*");
          for (let i = 0; i < lines.length; i += 2) {
            const key = lines[i].slice(1);
            let value = lines[i + 1] ?? "";
            value = value.substring(1);
            value = await makeReadyForImport(value);
            if (key) {
              localStorage.setItem(key, value);
            }
          }
        }
        alert(t("settings_Dialog_ImportSuccessful"));
      }
    }
  };

  const readFileContent = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const text = event.target?.result;
        resolve(text as string);
      };

      reader.onerror = (event) => {
        reject(event.target?.error);
      };

      reader.readAsText(file);
    });
  };

  return (
    <SettingsView
      showFingerprintBtn={showFingerprintBtn}
      onDeleteAllClick={handleDeleteAllClick}
      onDeleteBiometryClick={handleDeleteBiometryClick}
      onDatenschutzClick={handleDatenschutzClick}
      onImpressumClick={handleImpressumClick}
      onExportAllClick={handleExportAllClick}
      onFileChange={handleFileChange}
      onDeleteNotesClick={handleDeleteNotesClick}
      isAlreadyLoggedIn={isAlreadyLoggedIn}
    />
  );
};

export default SettingsContainer;
