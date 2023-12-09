import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Datenschutz from "./modules/legal/datenschutz";
import EncryptionKeyModal from "./custom_components/notNotesRelated/encryption_modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./custom_components/notNotesRelated/navBar";
import ViewNote from "./custom_components/handleNotes/viewNote";
import EditNote from "./custom_components/handleNotes/editNote";

const App: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div>
      {!encryptionKey ? (
        <div>
          <Router>
            <Routes>
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route
                path="/"
                element={<EncryptionKeyModal onSubmit={setEncryptionKey} />}
              />
            </Routes>
          </Router>
        </div>
      ) : (
        <div
          className="App"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#1E1E1E",
            color: "white",
          }}
        >
          <div style={{ marginTop: "8vh" }}>
            <Router>
              <Routes>
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route
                  path="/edit/:noteId"
                  element={<EditNote encryptionKey={encryptionKey} />}
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
                  element={<EditNote encryptionKey={encryptionKey} />}
                />
              </Routes>
              <NavBar setSearchQuery={setSearchQuery} />
            </Router>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
