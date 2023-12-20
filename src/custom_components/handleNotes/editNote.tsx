import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { FaRegSave, FaRegClock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import FloatingBtn ,{ButtonAlignment} from "../../modules/ui/floatingBtn";
import { encryptAndStore, decryptFromStorage } from "./encryptionEngine";

interface EditNoteProps {
  encryptionKey: string;
}

const EditNote: React.FC<EditNoteProps> = ({ encryptionKey }) => {
  let noteId = useParams<{ noteId?: string }>().noteId;

  const [noteTitle, setNoteTitle] = useState("");
  const [noteDate, setNoteDate] = useState(new Date());
  const [noteContent, setNoteContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (noteId) {
      try {
        const decryptedContent = decryptFromStorage(encryptionKey, noteId);
        const noteData = JSON.parse(decryptedContent);
        setNoteTitle(noteData.title);
        setNoteDate(new Date(noteData.date));
        setNoteContent(noteData.content);
      } catch (error) {
        setNoteTitle("");
        setNoteDate(new Date());
        setNoteContent("");
      }
    }
  }, [noteId, encryptionKey]);

  const handleSave = () => {
    const noteData = {
      title: noteTitle,
      date: noteDate.toISOString(),
      content: noteContent,
      additionalInfo: "",
    };
    const noteDataString = JSON.stringify(noteData);
    encryptAndStore(
      noteDataString,
      encryptionKey,
      noteId || Date.now().toString(),
    );
    navigate(-1);
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
        marginTop: "env(safe-area-inset-top)",
      }}
    >

      <Form>
        <Form.Group controlId="noteTitle">
          <Form.Control
            type="text"
            value={noteTitle}
            data-testid="noteTitleTest"
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
            data-testid="noteTextTest"
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

        <FloatingBtn
          alignment={ButtonAlignment.RIGHT}
          icon={FaRegSave}
          onClick={handleSave}
        />
      </Form>
    </div>
  );
};

export default EditNote;
