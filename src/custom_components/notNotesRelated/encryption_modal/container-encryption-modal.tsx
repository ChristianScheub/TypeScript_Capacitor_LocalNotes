import React, { FormEvent, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EncryptionKeyModalScreen from "./screen-encryption-modal";
import {
  getPasswordFromFingerprint,
  storePasswordFromFingerprint,
  availableBiometric,
} from "../fingerprintLogic";
import { getPBKDF2_Password } from "../../handleNotes/encryptionEngine";
import { useTranslation } from 'react-i18next';

interface EncryptionKeyModalContainerProps {
  onSubmit: (encryptionKey: string) => void;
}

const EncryptionKeyModalContainer: React.FC<
  EncryptionKeyModalContainerProps
> = ({ onSubmit }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [showFingerprintBtn, setShowFingerprintBtn] = useState(false);
  const { t } = useTranslation();


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
    const password = getPBKDF2_Password(inputRef.current!.value);
    onSubmit(password);
  };

  const activateFingerprint = async () => {
    getPasswordFromFingerprint(
      "www.LocalNotes.com",
      () => {
        storePasswordFromFingerprint(
          inputRef.current?.value || "",
          () => {
            alert("Passwort gespeichert!");
            const password = getPBKDF2_Password(inputRef.current!.value);
            onSubmit(password);
          },
          (errorMessage) => {
            alert(errorMessage);
          },
          t
        );
      },
      (password) => {        
        onSubmit(password);
      },
      (errorMessage) => {
        alert(errorMessage);
      },
      t
    );
  };

  return (
    <EncryptionKeyModalScreen
      showFingerprintBtn={showFingerprintBtn}
      activateFingerprint={activateFingerprint}
      handleKeySubmit={handleKeySubmit}
      inputRef={inputRef}
      navigateToPrivacy={() => navigate("/datenschutz")}
    />
  );
};

export default EncryptionKeyModalContainer;
