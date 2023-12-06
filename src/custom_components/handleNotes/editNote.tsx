import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import CryptoJS from "crypto-js";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaRegSave, FaTrash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

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
      return CryptoJS.AES.decrypt(encryptedNote, encryptionKey).toString(CryptoJS.enc.Utf8);
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
    <Card style={{ margin: "2vw", marginTop:"20vw",backgroundColor: "#49454F", color: "white",minHeight:"70vh" }}>
      <Card.Body>
        <Card.Title>Notiz bearbeiten</Card.Title>
        <Form>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              style={{ backgroundColor: "#1D1B20",color:"white",minHeight:"55vh" }}
            />
          </Form.Group>
          <br />
          <Button variant="primary" onClick={handleSave} data-testid="save-note-button" style={{height:"7vh",width:"7vh"}}> 
            <FaRegSave size="4vh" />
          </Button>{" "}
          <Button variant="danger" onClick={handleDelete} data-testid="delete-note-button" style={{height:"7vh",width:"7vh", marginLeft:"55vw"}}>
            <FaTrash size="4vh"/>
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditNote;
