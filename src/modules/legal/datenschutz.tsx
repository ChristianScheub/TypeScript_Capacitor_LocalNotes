import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";
import { iOS_Notch_Present } from '../../custom_components/notNotesRelated/appleNotchDetected';

const Datenschutz: React.FC = () => {
  const navigate = useNavigate();
  const [isIOSNotch, setIsIOSNotch] = useState(false);

  useEffect(() => {
    iOS_Notch_Present().then(notchPresent => {
      setIsIOSNotch(notchPresent);
    });
  }, []);
  return (
    <div
    style={{
      paddingTop: isIOSNotch ? '10vw' : '0',
    }}>
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
