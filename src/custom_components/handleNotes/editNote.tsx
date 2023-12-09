import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { FaRegSave, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FloatingBtn from "../../modules/ui/floatingBtn";

interface EditNoteProps {
  encryptionKey: string;
}

const EditNote: React.FC<EditNoteProps> = ({ encryptionKey }) => {
  const noteId = useParams<{ noteId: string }>()?.noteId ?? null;
  const [noteContent, setNoteContent] = useState("");
  const navigate = useNavigate();

  const loadNote = (noteId: string, encryptionKey: string) => {
    const encryptedNote = localStorage.getItem(noteId);
    if (encryptedNote) {
      return CryptoJS.AES.decrypt(encryptedNote, encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
    }
    return "";
  };

  useEffect(() => {
    if (noteId) {
      setNoteContent(loadNote(noteId, encryptionKey));
    }
  }, [noteId, encryptionKey]);

  const handleSave = () => {
    const encryptedContent = CryptoJS.AES.encrypt(
      noteContent,
      encryptionKey
    ).toString();
    localStorage.setItem(noteId || Date.now().toString(), encryptedContent);
    navigate(-1);
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
          zIndex:"101"
        }}
      >
        <FaTrash size="2.5vh" style={{color:"#DA5353"}}/>
      </Button>

      <Form>
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
              fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              padding: "10px",
              minHeight: "80vh",
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
