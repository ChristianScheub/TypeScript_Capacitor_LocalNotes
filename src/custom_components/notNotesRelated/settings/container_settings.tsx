import { NavigateFunction } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import SettingsView from "./screen_settings";
import React, { useState, useEffect } from "react";
import { availableBiometric } from "../fingerprintLogic";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";
import { makeReadyForExport,makeReadyForImport } from "../../handleNotes/encryptionEngine";

const SettingsContainer: React.FC = () => {
  const handleImpressumClick = (navigate: NavigateFunction) => {
    navigate("/impressum");
  };
  const handleDatenschutzClick = (navigate: NavigateFunction) => {
    navigate("/datenschutz");
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

  const handleDeleteAllClick = async (
    showFingerprintBtn: boolean,
    navigate: NavigateFunction
  ): Promise<void> => {
    if (
      window.confirm(
        "Sind sie sicher? Es werden alle Notizen und das Passwort gelöscht!"
      )
    ) {
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
      alert("Daten erfolgreich gelöscht!");
    }
  };

  const handleDeleteNotesClick = async (): Promise<void> => {
    if (window.confirm("Sind sie sicher? Es werden alle Notizen gelöscht!")) {
      localStorage.clear();
      alert("Notizen erfolgreich gelöscht!");
    }
  };

  const handleDeleteBiometryClick = async () => {
    if (
      window.confirm(
        "Sind sie sicher? Es wird das Passwort für den Biometrischen Login gelöscht. Die Notizen sind allerdings weiterhin abrufbar durch die Passwort Eingabe."
      )
    ) {
      try {
        await NativeBiometric.deleteCredentials({
          server: "www.LocalNotes.com",
        });
        alert("Login Daten gelöscht! Sie können diese nun neu setzen!");
      } catch (error) {
        console.error("Fehler beim Löschen der Credentials", error);
      }
    }
  };

  const handleExportAllClick = async () => {
    let notes = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key !== null) {
        const item = localStorage.getItem(key);
        if (item !== null) {
          const value = makeReadyForExport(item);
          notes += `${key}\n ${value}\n`;
        }
      }
    }

    try {
      const fileName = "notes.txt";
      const base64Data = btoa(notes);

      const filePath = `${Directory.Documents}/${fileName}`;
      let shareUrl = filePath;

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      if (Capacitor.getPlatform() === "android") {
        const uriResult = await Filesystem.getUri({
          directory: Directory.Documents,
          path: fileName,
        });
        shareUrl = uriResult.uri;
      }

      // Teilen der Datei
      await Share.share({
        title: "Teilen der Notizen",
        text: "Hier sind meine Notizen.",
        url: shareUrl,
        dialogTitle: "Wähle eine App zum Teilen",
      });
    } catch (e) {
      console.error("Error during export or sharing", e);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (
      window.confirm(
        "Sind sie sicher? Es könnten bereits vorhandene Notizen überschrieben werden!"
      )
    ) {
      if (file) {
        const fileContent = await readFileContent(file);
        if (fileContent) {
          const lines = fileContent.trim().split("\n");
          for (let i = 0; i < lines.length; i += 2) {
            const key = lines[i];
            let value = lines[i + 1] ?? "";
            value = value.substring(1);
            value = await makeReadyForImport(value);
            if (key) {
              localStorage.setItem(key, value);
            }
          }
        }
        alert("Notizen erfolgreich importiert!");
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
    />
  );
};

export default SettingsContainer;
