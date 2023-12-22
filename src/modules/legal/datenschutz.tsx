import { Card } from "react-bootstrap";
import { datenschutz_text } from "../app_configuration/app_texts";
import CodeToTextParser from "./codeToTextParser";

const Datenschutz: React.FC = () => {

  return (
    <div
    style={{
      marginTop: "env(safe-area-inset-top)",
    }}>
      <div className="after-login-container">
        <Card className="mb-3" style={{ margin: "2vw",backgroundColor: "#49454F", color: "white" }}>
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
