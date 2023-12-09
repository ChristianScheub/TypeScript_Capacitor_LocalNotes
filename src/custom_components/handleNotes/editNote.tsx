import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { FaRegSave, FaTrash, FaRegClock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FloatingBtn from "../../modules/ui/floatingBtn";
import { encryptAndStore, decryptFromStorage } from "./encryptionEngine";

interface EditNoteProps {
  encryptionKey: string;
}

const EditNote: React.FC<EditNoteProps> = ({ encryptionKey }) => {
  const noteId = useParams<{ noteId: string }>()?.noteId ?? null;
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDate, setNoteDate] = useState(new Date());
  const [noteContent, setNoteContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (noteId) {
      const decryptedContent = decryptFromStorage(encryptionKey, noteId);
      const noteData = JSON.parse(decryptedContent);
      console.log(decryptedContent);
      setNoteTitle(noteData.title);
      setNoteDate(new Date(noteData.date));
      setNoteContent(noteData.content);
    }
  }, [noteId, encryptionKey]);

  const handleSave = () => {
    const noteData = {
      title: noteTitle,
      date: noteDate.toISOString(),
      content: noteContent,
    };
    const noteDataString = JSON.stringify(noteData);
    encryptAndStore(
      noteDataString,
      encryptionKey,
      noteId || Date.now().toString()
    );
    navigate(-1);
  };

  const formatDate = (date: Date): string => {
    const pad = (num: number) => num.toString().padStart(2, "0");
    return `${pad(date.getDate())}.${pad(
      date.getMonth() + 1
    )}.${date.getFullYear()}`;
  };

  const handleDelete = () => {
    if (
      noteId &&
      window.confirm("Sind Sie sicher, dass Sie diese Notiz löschen möchten?")
    ) {
      localStorage.removeItem(noteId);
      navigate(-1);
    }
  };
  const formattedDate = `${noteDate.getDate()}.${
    noteDate.getMonth() + 1
  }.${noteDate.getFullYear()}`;

  return (
    <div
      style={{
        margin: "2vw",
        color: "white",
        minHeight: "70vh",
      }}
    >
      <Button
        onClick={handleDelete}
        data-testid="delete-note-button"
        style={{
          position: "absolute",
          top: "0.5vh",
          height: "7vh",
          width: "7vh",
          backgroundColor: "transparent",
          border: "none",
          marginLeft: "65vw",
          zIndex: "101",
        }}
      >
        <FaTrash size="2.5vh" style={{ color: "#DA5353" }} />
      </Button>

      <Form>
        <Form.Group controlId="noteTitle">
          <Form.Control
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              color: "white",
              fontSize: "30px",
              fontWeight: "bold",
              marginBottom: "8px",
              marginTop: "1vh",
            }}
          />
        </Form.Group>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
            paddingBottom: "2rem",
            borderBottom: "1px solid #ffffff50",
          }}
        >
          <FaRegClock
            style={{
              color: "#CBCBCD",
              marginRight: "0.5rem",
              marginLeft: "1rem",
            }}
          />
          <Form.Text style={{ color: "#CBCBCD", fontSize: "1rem" }}>
            {formattedDate}
          </Form.Text>
        </div>

        <Form.Group>
          <Form.Control
            as="textarea"
            rows={5}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            style={{
              backgroundColor: "#1D1B20",
              color: "white",
              border: "0",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              padding: "10px",
              height: "70vh",
            }}
          />
        </Form.Group>
        <br />

        <FloatingBtn centered={false} icon={FaRegSave} onClick={handleSave} />
      </Form>
    </div>
  );
};

export default EditNote;
