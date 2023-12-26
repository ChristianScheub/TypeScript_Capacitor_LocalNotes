import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { encryptAndStore, decryptFromStorage } from '../encryptionEngine';
import EditNoteView from './screen-editNote'; 

interface EditNoteContainerProps {
  encryptionKey: string;
}

const EditNoteContainer: React.FC<EditNoteContainerProps> = ({ encryptionKey }) => {
  let { noteId } = useParams<{ noteId?: string }>();
  const navigate = useNavigate();

  const [noteTitle, setNoteTitle] = useState('');
  const [noteDate, setNoteDate] = useState(new Date());
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    const loadAndDecryptNote = async () => {
      if (noteId) {
        try {
          const decryptedContent = await decryptFromStorage(encryptionKey, noteId);
          const noteData = JSON.parse(decryptedContent);
          setNoteTitle(noteData.title);
          setNoteDate(new Date(noteData.date));
          setNoteContent(noteData.content);
        } catch (error) {
          //console.error('Fehler beim Laden und Entschlüsseln der Notiz:', error);
        }
      }
    };
  
    loadAndDecryptNote();
  }, [noteId, encryptionKey]); 
  

  const handleSave = () => {
    const noteData = {
      title: noteTitle,
      date: noteDate.toISOString(),
      content: noteContent,
    };
    const noteDataString = JSON.stringify(noteData);
    encryptAndStore(noteDataString, encryptionKey, noteId || Date.now().toString());
    navigate(-1); 
  };

  return (
    <EditNoteView
      noteTitle={noteTitle}
      noteDate={noteDate}
      noteContent={noteContent}
      setNoteTitle={setNoteTitle}
      setNoteContent={setNoteContent}
      handleSave={handleSave}
    />
  );
};

export default EditNoteContainer;
