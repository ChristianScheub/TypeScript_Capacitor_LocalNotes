import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EncryptionKeyModalScreen from './screen-encryption-modal';
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
  availableBiometric,
} from "../fingerprintLogic";

interface EncryptionKeyModalContainerProps {
  onSubmit: (encryptionKey: string) => void;
}

const EncryptionKeyModalContainer: React.FC<EncryptionKeyModalContainerProps> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      if (await availableBiometric()) {
        setShowFingerprintBtn(true);
      }
    };
    checkBiometrics();
  }, []);

  const handleKeySubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(inputRef.current!.value);
  };

  const activateFingerprint = async () => {
    getPasswordFromFingerprint(
      "www.LocalNotes.com",
      () => {
        storePasswordFromFingerprint(
          inputRef.current?.value || "",
          () => {
            alert("Passwort gespeichert!");
            onSubmit(inputRef.current!.value);
          },
          (errorMessage) => {
            alert(errorMessage);
          }
        );
      },
      (password) => {
        inputRef.current!.value = password;
        onSubmit(password);
      },
      (errorMessage) => {
        alert(errorMessage);
      }
    );
  };


  return <EncryptionKeyModalScreen
    showFingerprintBtn={showFingerprintBtn}
    activateFingerprint={activateFingerprint}
    handleKeySubmit={handleKeySubmit}
    inputRef={inputRef}
    navigateToPrivacy={() => navigate("/datenschutz")}
  />;
};

export default EncryptionKeyModalContainer;
