import { useState, useEffect } from "react";
import { decryptFromStorage } from "../encryptionEngine";
import { useLocation } from 'react-router-dom';

interface Note {
  id: string;
  content: string;
  title: string;
  date: Date;
  additionalInfo: String;
}

const isJsonString = (str: string): boolean => {
  try {
    const data = JSON.parse(str);
    const test = data.content + data.title;
    return true;
  } catch (e) {
    return false;
  }
};

const useAllNotes = (encryptionKey: string, searchQuery: string): Note[] => {
  const [notes, setNotes] = useState<Note[]>([]);
  const location = useLocation(); 

  useEffect(() => {
    const loadAndDecryptNotes = async () => {
      const loadedNotes: Note[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const originalText = await decryptFromStorage(encryptionKey, key);
            if (originalText && isJsonString(originalText)) {
              const noteData = JSON.parse(originalText);
              loadedNotes.push({
                id: key,
                content: noteData.content,
                title: noteData.title,
                date: new Date(noteData.date),
                additionalInfo: "",
              });
            }
          } catch (error) {
            //console.log("Decryption or JSON parsing failed", error);
          }
        }
      }
      const filteredNotes = loadedNotes.filter((note) =>
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      filteredNotes.sort((a, b) => b.date.getTime() - a.date.getTime());

      setNotes(filteredNotes);
    };
    loadAndDecryptNotes();
  }, [encryptionKey, searchQuery,location]);

  return notes;
};

export default useAllNotes;