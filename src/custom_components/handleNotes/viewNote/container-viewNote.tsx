import React from 'react';
import { useNavigate } from 'react-router-dom';
import getAllNotes from './getNotes';
import ViewNoteView from './screen-viewNote'; // Import der View-Komponente

interface ViewNoteContainerProps {
  encryptionKey: string;
  searchQuery: string;
}

const ViewNoteContainer: React.FC<ViewNoteContainerProps> = ({ encryptionKey, searchQuery }) => {
  const notes = getAllNotes(encryptionKey, searchQuery);
  const navigate = useNavigate();

  const handleNavigateToEdit = (noteId: string) => {
    navigate(`/edit/${noteId}`);
  };

  const handleNavigateToCreateNew = () => {
    navigate("/edit/new");
  };

  return (
    <ViewNoteView
      notes={notes}
      onNavigateToEdit={handleNavigateToEdit}
      onNavigateToCreateNew={handleNavigateToCreateNew}
    />
  );
};

export default ViewNoteContainer;
