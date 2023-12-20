import React, { useState } from "react";
import { Navbar, Container, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";

interface NavBarProps {
  setSearchQuery: (query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setSearchQuery }) => {
  const navigate = useNavigate();
  const [tempSearch, setTempSearch] = useState("");
  const location = useLocation();
  const noteID =
    location.pathname.split("/")[location.pathname.split("/").length - 1];

  const handleImpressumClick = () => {
    navigate("/datenschutz");
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSearch(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(tempSearch);
  };

  const handleDelete = () => {
    if (
      noteID &&
      window.confirm("Sind Sie sicher, dass Sie diese Notiz löschen möchten?")
    ) {
      localStorage.removeItem(noteID!);
      navigate(-1);
    }
  };

  const showBackButton =
    location.pathname.includes("/datenschutz") ||
    location.pathname.includes("/edit");

    const showDeleteBtn =! location.pathname.includes("/datenschutz");

  return (
    <Navbar
      variant="dark"
      className="justify-content-between"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "#161616",
        borderBottom: "1px solid #6c757d",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <Container>
        {showBackButton ? (
          <div style={{ width: "80vw" }}>
            <Button
              onClick={handleBackClick}
              style={{
                left: "0vw",
                backgroundColor: "transparent",
                border: "none",
                height: "6vh",
                width: "20vw",
              }}
              data-testid="back-button"
            >
              <FaAngleLeft size="4vh" />
            </Button>
            {showDeleteBtn && 
              <Button
                onClick={handleDelete}
                data-testid="delete-note-button"
                style={{
                  height: "7vh",
                  width: "7vh",
                  backgroundColor: "transparent",
                  border: "none",
                  zIndex: "101",
                  paddingLeft: "50vw"
                }}
              >
                <FaTrash size="2.5vh" style={{ color: "#DA5353" }} />
              </Button>
               }
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <input
              type="search"
              aria-label="Search"
              placeholder="Notizen suchen..."
              onChange={handleSearchChange}
              value={tempSearch}
              style={{
                flex: 1,
                border: "none",
                padding: "0.75rem 1rem",
                marginLeft: "10vw",
                borderRadius: "30px",
                color: "#fff",
                backgroundColor: "#25262B",
                width: "70vw",
                marginTop:"1vh"
              }}
            />
          </Form>
        )}

        <Button
          variant="link"
          onClick={handleImpressumClick}
          style={{ height: "6vh" }}
        >
          <FaInfoCircle size="2.5vh" />
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavBar;
