import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface NpmModule {
  name: string;
  version: string;
  licenses: string;
  repository: string;
}

interface UsedLibListScreenProps {
  open: boolean;
  handleClose: () => void;
  npmModules: NpmModule[];
}

const UsedLibListScreen: React.FC<UsedLibListScreenProps> = ({
  open,
  handleClose,
  npmModules,
}) => {
  const { t } = useTranslation();
  const handleModuleClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="sm"
      centered
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title data-testid="setting_OpenSurceModulListTItle">{t("setting_OpenSurceModulListTItle")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup data-testid="used-lib-list-modal" variant="flush">
          {npmModules.map((module, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => handleModuleClick(module.repository)}
              className="bg-dark text-light"
            >
              <div>
                <strong>{`${module.name}@${module.version}`}</strong>
              </div>
              <div className="text-muted">License: {module.licenses}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} data-testid="close-btn-lib-list-modal">
          {t("setting_OpenSourceModulListClose")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsedLibListScreen;
