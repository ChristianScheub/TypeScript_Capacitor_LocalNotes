import { Card } from "react-bootstrap";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";


const Datenschutz: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
    style={{
      marginTop: "env(safe-area-inset-top)",
    }}>
      <div className="after-login-container">
        <Card className="mb-3" style={{ margin: "2vw",backgroundColor: "#49454F", color: "white" }}>
        <MdArrowBack
              style={{ cursor: "pointer" }}
              onClick={() => navigate(-1)}
              data-testid="backButton"
            />
          <Card.Header as="h2">
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
