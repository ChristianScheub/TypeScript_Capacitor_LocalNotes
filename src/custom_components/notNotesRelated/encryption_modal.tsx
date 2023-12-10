import React, { FormEvent, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingBtn ,{ ButtonAlignment }  from "../../modules/ui/floatingBtn";
import { FaInfoCircle } from "react-icons/fa";
import { PiFingerprintThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { NativeBiometric } from "capacitor-native-biometric";
import { Plugins } from '@capacitor/core';
import CryptoJS from "crypto-js";

import { Device } from '@capacitor/device';

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

  const getPassword = async () => {
    try {
      const available = await NativeBiometric.isAvailable();

      if (available.isAvailable) {
        const verified = await NativeBiometric.verifyIdentity({
          reason: "Bitte bestätige deine Identität",
          title: "Biometrische Authentifizierung",
        })
          .then(() => true)
          .catch(() => false);

        if (!verified) return;

        const credentials = await NativeBiometric.getCredentials({
          server: "www.LocalNotes.com",
        });

        if (credentials && inputRef.current) {
          if(credentials.password!==""){
            const hashedDeviceId = await getDeviceIdHash();
            inputRef.current.value = CryptoJS.TripleDES.decrypt(credentials.password, hashedDeviceId).toString(CryptoJS.enc.Utf8);
            onSubmit(inputRef.current!.value);
          }
          else{
            storePassword();
          }
        }
      } else {
        alert("Biometrische Authentifizierung nicht verfügbar.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const storePassword = async (): Promise<void> => {
    try {
      const available = await NativeBiometric.isAvailable();

      if (available.isAvailable) {
        if (inputRef.current) {
          const hashedDeviceId = await getDeviceIdHash();
          await NativeBiometric.setCredentials({
            server: "www.LocalNotes.com",
            username: "user",
            password: CryptoJS.TripleDES.encrypt(inputRef.current.value, hashedDeviceId).toString(),
          });

          alert("Passwort gespeichert!");
        } else {
          console.error("Fehler: inputRef.current ist null");
        }
      } else {
        alert("Biometrische Authentifizierung nicht verfügbar.");
      }
    } catch (e) {
      console.error("Fehler beim Speichern des Passworts:", e);
    }
  };

  

  const getDeviceIdHash = async (): Promise<string> => {
    const info = await Device.getId();
    if (!info) {
      throw new Error('Info-Komponente nicht verfügbar');
    }
  
    if (!info.identifier) {
      throw new Error('UUID nicht verfügbar');
    }
  
    return CryptoJS.SHA256(info.identifier).toString();
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
          onClick={() => getPassword()}
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
