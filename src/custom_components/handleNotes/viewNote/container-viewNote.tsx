import React from 'react';
import { useNavigate } from 'react-router-dom';
import getAllNotes from './getNotes';
import ViewNoteView from './screen-viewNote';
import { useLocation } from 'react-router-dom';


interface ViewNoteContainerProps {
  encryptionKey: string;
  searchQuery: string;
}

const ViewNoteContainer: React.FC<ViewNoteContainerProps> = ({ encryptionKey, searchQuery }) => {
  const location = useLocation();
  const notes = getAllNotes(encryptionKey, searchQuery, location);

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
