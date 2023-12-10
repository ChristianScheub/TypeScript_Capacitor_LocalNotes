import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPlusCircle } from "react-icons/fa";
import getAllNotes from "./getNotes";
import FloatingBtn, { ButtonAlignment } from "../../modules/ui/floatingBtn";

interface ViewNoteProps {
  encryptionKey: string;
  searchQuery: string;
}

const ViewNote: React.FC<ViewNoteProps> = ({ encryptionKey, searchQuery }) => {
  const notes = getAllNotes(encryptionKey, searchQuery);
  const navigate = useNavigate();

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div>
      {notes.length > 0 ? (
        <Row
          xs={2}
          md={2}
          lg={3}
          style={{
            margin: "1vw",
          }}
        >
          {" "}
          {notes.map((note) => (
            <Col key={note.id} style={{ marginBottom: "5vw" }}>
              <Card
                style={{
                  backgroundColor: "#49454F",
                  color: "white",
                  height: "100%",
                  margin: "2vw",
                  minHeight: "20vh",
                }}
                onClick={() => navigate(`/edit/${note.id}`)}
              >
                <Card.Body>
                  <Card.Title>{truncateText(note.title, 10)}</Card.Title>

                  <Card.Text>{truncateText(note.content, 100)}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card
          style={{
            margin: "2vw",
            backgroundColor: "#49454F",
            color: "white",
            minHeight: "25vh",
          }}
        >
          <Card.Body>
            <Card.Text>
              {truncateText("Noch keine Notizen vorhanden!", 150)}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <FloatingBtn
        alignment={ButtonAlignment.CENTER}
        icon={FaPlusCircle}
        onClick={() => navigate("/edit/new")}
      />
    </div>
  );
};

export default ViewNote;
