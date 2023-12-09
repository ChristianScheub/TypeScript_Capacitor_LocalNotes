import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";

const Datenschutz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="after-login-container">
        <Card className="mb-3" style={{ margin: "2vw",backgroundColor: "#49454F", color: "white" }}>
          <Card.Header as="h2">
            <MdArrowBack
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
              data-testid="backButton"
            />
            Infos
          </Card.Header>
          <Card.Body>
            <CodeToTextParser code={datenschutz_text} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Datenschutz;
