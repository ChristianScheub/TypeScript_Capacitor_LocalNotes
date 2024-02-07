import { Card } from "react-bootstrap";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import NavBarContainer from "../../custom_components/notNotesRelated/navBar/container-navBar";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";

const Datenschutz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAlreadyLoggedIn = !location.pathname.includes("Home");
  const [searchQueryPlaceholder, setSearchQueryPlaceholder] =
    useState<string>("");

  return (
    <div
      style={{
        ...(isAlreadyLoggedIn
          ? {}
          : {
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#1E1E1E",
              color: "white",
              paddingTop: "15vw",
            }),
      }}
    >
      <div
        style={{
          marginTop: "env(safe-area-inset-top)",
        }}
      >
        {!isAlreadyLoggedIn && (
          <>
            <NavBarContainer setSearchQuery={setSearchQueryPlaceholder} />
          </>
        )}
        <div className="after-login-container">
          <Card
            className="mb-3"
            style={{
              margin: "2vw",
              backgroundColor: "#49454F",
              color: "white",
            }}
          >
            <Card.Header as="h2">Infos</Card.Header>
            <Card.Body>
              <CodeToTextParser code={datenschutz_text} />
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Datenschutz;
