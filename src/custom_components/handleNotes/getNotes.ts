import { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

interface Note {
  id: string;
  content: string;
}

const useNotes = (encryptionKey: string, searchQuery: string): Note[] => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const loadedNotes: Note[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const encryptedNote = localStorage.getItem(key);
        if (encryptedNote) {
          try {
            const bytes = CryptoJS.AES.decrypt(encryptedNote, encryptionKey);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            loadedNotes.push({ id: key, content: originalText });
          } catch (error) {
          }
        }
      }
    }
    const filteredNotes = loadedNotes.filter(note =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setNotes(filteredNotes);
  }, [encryptionKey, searchQuery]);

  return notes;
};

export default useNotes;