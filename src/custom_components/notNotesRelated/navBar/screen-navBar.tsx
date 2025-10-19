import React from "react";
import { Navbar, Container, Button, Form } from "react-bootstrap";
import { FaTrash, FaAngleLeft } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { TFunction } from "i18next";

interface NavBarViewProps {
  tempSearch: string;
  showBackButton: boolean;
  showDeleteBtn: boolean;
  showSettingsButton: boolean;
  onBackClick: () => void;
  onDeleteClick: () => void;
  onSettingsClick: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  t: TFunction;
}

const NavBarView: React.FC<NavBarViewProps> = ({
  tempSearch,
  showBackButton,
  showDeleteBtn,
  showSettingsButton,
  onBackClick,
  onDeleteClick,
  onSettingsClick,
  onSearchChange,
  onSearchSubmit,
  t,
}) => {
  return (
    <Navbar
      variant="dark"
      className="justify-content-between"
      style={{
        position: "absolute",
        top: "0vw",
        paddingTop: "env(safe-area-inset-top)",
        width: "100%",
        backgroundColor: "#161616",
        borderBottom: "1px solid #6c757d",
      }}
    >
      <Container style={{ width: "90vw", maxWidth: "90vw", height: "3em" }}>
        {showBackButton ? (
          <div style={{ width: "80vw" }}>
            <Button
              onClick={onBackClick}
              data-testid="back-button"
              style={{
                left: "0vw",
                backgroundColor: "transparent",
                border: "none",
                height: "6vh",
                width: "10vw",
              }}
            >
              <FaAngleLeft size="2em" />
            </Button>
            {showDeleteBtn && (
              <Button
                onClick={onDeleteClick}
                data-testid="delete-note-button"
                style={{
                  height: "2em",
                  width: "2em",
                  backgroundColor: "transparent",
                  border: "none",
                  zIndex: "101",
                  paddingLeft: "50vw ",
                }}
              >
                <FaTrash size="1em" style={{ color: "#DA5353" }} />
              </Button>
            )}
          </div>
        ) : (
          <Form onSubmit={onSearchSubmit}>
            <input
              type="search"
              aria-label="Search"
              placeholder={t("navbar_searchForm")}
              onChange={onSearchChange}
              data-testid="navbar_searchForm"
              value={tempSearch}
              style={{
                flex: 1,
                border: "none",
                padding: "0.75rem 1rem",
                marginLeft: "10vw",
                borderRadius: "30px",
                color: "#fff",
                backgroundColor: "#25262B",
                width: "70vw",
                marginTop: "1vh",
              }}
            />
          </Form>
        )}
          {showSettingsButton && (
            <Button
              variant="link"
              onClick={onSettingsClick}
              style={{ height: "2em" }}
            >
              <MdOutlineSettings size="1.5em" />
            </Button>
          )}
      </Container>
    </Navbar>
  );
};

export default NavBarView;