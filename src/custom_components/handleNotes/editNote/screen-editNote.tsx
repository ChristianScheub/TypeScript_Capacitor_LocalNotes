import React from 'react';
import { Form } from 'react-bootstrap';
import { FaRegSave, FaRegClock } from 'react-icons/fa';
import FloatingBtn, { ButtonAlignment } from '../../../modules/ui/floatingBtn';

interface EditNoteViewProps {
  noteTitle: string;
  noteDate: Date;
  noteContent: string;
  setNoteTitle: (title: string) => void;
  setNoteContent: (content: string) => void;
  handleSave: () => void;
}

const EditNoteView: React.FC<EditNoteViewProps> = ({
  noteTitle,
  noteDate,
  noteContent,
  setNoteTitle,
  setNoteContent,
  handleSave
}) => {
  const formattedDate = `${noteDate.getDate()}.${
    noteDate.getMonth() + 1
  }.${noteDate.getFullYear()}`;

  return (
    <div
      style={{
        margin: '2vw',
        color: 'white',
        minHeight: '70vh',
        marginTop: 'env(safe-area-inset-top)',
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
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
              color: 'white',
              fontSize: '30px',
              fontWeight: 'bold',
              marginBottom: '8px',
              marginTop: '1vh',
            }}
          />
        </Form.Group>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            paddingBottom: '2rem',
            borderBottom: '1px solid #ffffff50',
          }}
        >
          <FaRegClock
            style={{
              color: '#CBCBCD',
              marginRight: '0.5rem',
              marginLeft: '1rem',
            }}
          />
          <Form.Text style={{ color: '#CBCBCD', fontSize: '1rem' }}>
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
              backgroundColor: '#1D1B20',
              color: 'white',
              border: '0',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              padding: '10px',
              height: '70vh',
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

export default EditNoteView;
