import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { impressum_text } from '../app_configuration/app_texts';
import CodeToTextParser from './codeToTextParser';


const Impressum: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="after-login-container">
        <Card className="mb-3">
          <Card.Header as="h2">
            <MdArrowBack style={{ cursor: 'pointer' }} onClick={() => navigate(-1)} data-testid="backButton" />
            Impressum
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