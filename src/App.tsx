import React, { useState } from "react";
import NavBar from "./custom_components/navBar";
import EditNote from "./custom_components/handleNotes/editNote";
import ViewNote from "./custom_components/handleNotes/viewNote";
import "bootstrap/dist/css/bootstrap.min.css";
import Impressum from "./modules/legal/impressum";
import Datenschutz from "./modules/legal/datenschutz";
import EncryptionKeyModal from "./custom_components/encryption_modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


const App: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [keyModalVisible, setKeyModalVisible] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const handleKeySubmit = (key: string) => {
    setEncryptionKey(key);
    setKeyModalVisible(false);
  };


  

  return (
    <Router>
      <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor:"#1D1B20", color:"white" }}>
        <EncryptionKeyModal
          show={keyModalVisible}
          onHide={() => setKeyModalVisible(false)}
          onSubmit={handleKeySubmit}
        />


        <Routes>
          <Route
            path="/edit/:noteId"
            element={
              <EditNote encryptionKey={encryptionKey}  />
            }
          />
          <Route
            path="/"
            element={
              <ViewNote
                encryptionKey={encryptionKey}
                searchQuery={searchQuery}
              />
            }
          />

          <Route
            path="/edit/new"
            element={
              <EditNote encryptionKey={encryptionKey} />
            }
          />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
        <NavBar setSearchQuery={setSearchQuery} />

      </div>
    </Router>
  );
};

export default App;
