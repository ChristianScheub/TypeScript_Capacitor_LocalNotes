import { Card } from "react-bootstrap";
import { impressum_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";

const Impressum: React.FC = () => {

  return (
    <div
    style={{
      marginTop: "env(safe-area-inset-top)",
    }}>
      <div className="after-login-container">
        <Card className="mb-3" style={{ margin: "2vw",backgroundColor: "#49454F", color: "white" }}>
          <Card.Header as="h2">
            Impressum / Legal Notice
          </Card.Header>
          <Card.Body>
            <CodeToTextParser code={impressum_text} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Impressum;
