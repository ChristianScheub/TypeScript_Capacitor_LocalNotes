import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaPlusCircle } from "react-icons/fa";
import FloatingBtn, { ButtonAlignment } from "../../../modules/ui/floatingBtn";
import { useTranslation } from "react-i18next";
import { FaArrowDownLong } from "react-icons/fa6";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface ViewNoteViewProps {
  notes: Note[];
  onNavigateToEdit: (noteId: string) => void;
  onNavigateToCreateNew: () => void;
}

const ViewNoteView: React.FC<ViewNoteViewProps> = ({
  notes,
  onNavigateToEdit,
  onNavigateToCreateNew,
}) => {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };
  const { t } = useTranslation();

  return (
    <div
      style={{
        marginTop: "env(safe-area-inset-top)",
      }}
    >
      {notes.length > 0 ? (
        <Row xs={2} md={2} lg={3} style={{ margin: "1vw" }}>
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
                onClick={() => onNavigateToEdit(note.id)}
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
        <div>
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
                {truncateText(t("placeholder_noNotes"), 150)}
              </Card.Text>
            </Card.Body>
          </Card>
          <div
            style={{
              display: "flex",
              textAlign: "center",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "60vh",
            }}
          >
            <p style={{ fontSize: "8vw" }}>
              {" "}
              <br /> {t("viewNote_hint")}
            </p>
            <FaArrowDownLong style={{ color: "white", fontSize: "14vw" }} />
          </div>
        </div>
      )}

      <FloatingBtn
        alignment={ButtonAlignment.CENTER}
        icon={FaPlusCircle}
        onClick={onNavigateToCreateNew}
      />
    </div>
  );
};

export default ViewNoteView;
