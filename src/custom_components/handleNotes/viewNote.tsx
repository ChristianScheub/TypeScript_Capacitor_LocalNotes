import React from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPlusCircle } from "react-icons/fa";
import useNotes from "./getNotes";

interface ViewNoteProps {
  encryptionKey: string;
  searchQuery: string;
}

const ViewNote: React.FC<ViewNoteProps> = ({ encryptionKey, searchQuery }) => {
  const notes = useNotes(encryptionKey, searchQuery);
  const navigate = useNavigate();

  const handleAddNote = () => {
    navigate("/edit/new");
  };

  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <div>
      {notes.length > 0 ? (
        <Row xs={2} md={2} lg={3} style={{
          margin: "1vw"}}> {/* Definiert das Grid mit einer Spalte für kleine Bildschirme, zwei Spalten für mittlere Bildschirme und drei Spalten für größere Bildschirme */}
          {notes.map((note) => (
            <Col key={note.id}>
              <Card
                style={{
                  margin: "2vw",
                  backgroundColor: "#49454F",
                  color: "white",
                  minHeight: "25vh",
                }}
                onClick={() => navigate(`/edit/${note.id}`)}
              >
                <Card.Body>
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
            <Card.Text>{truncateText("Noch keine Notizen vorhanden!", 150)}</Card.Text>
          </Card.Body>
        </Card>
      )}
      
      <div style={{ position: "fixed", bottom: "28vw", left: "20px" }}>
        <Button
          style={{ backgroundColor: "#001D32", height: "8vh" }}
          onClick={handleAddNote}
        >
          <FaPlusCircle size={30} />
        </Button>
      </div>
    </div>
  );
};

export default ViewNote;
