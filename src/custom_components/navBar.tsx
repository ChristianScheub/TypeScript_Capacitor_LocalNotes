import React, { useState } from "react";
import { Navbar, Container, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation } from "react-router-dom"; // Importieren Sie useLocation

interface NavBarProps {
  setSearchQuery: (query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setSearchQuery }) => {
  const navigate = useNavigate();
  const [tempSearch, setTempSearch] = useState("");
  const location = useLocation();

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

  const showBackButton =
    location.pathname.includes("/datenschutz") ||
    location.pathname.includes("/edit");

  return (
    <Navbar
      variant="dark"
      className="justify-content-between"
      style={{
        position: "sticky",
        bottom: 0,
        height: "10vh",
        zIndex: 1000,
        marginTop: "auto",
        backgroundColor: "#006399",
      }}
    >
      <Container>
        {showBackButton ? (
          <Button
            variant="outline-light"
            onClick={handleBackClick}
            style={{ height: "8vh", width: "20vw" }}
            data-testid="back-button"
          >
            <IoMdArrowRoundBack size="4vh" />
          </Button>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormControl
              type="text"
              placeholder="Notizen suchen"
              className="mr-sm-2"
              onChange={handleSearchChange}
              value={tempSearch}
              style={{
                width: "80vw",
                height: "8vh",
                backgroundColor: "#CDE5FF",
              }}
            />
          </Form>
        )}

        <Button
          variant="outline-light"
          onClick={handleImpressumClick}
          style={{ height: "8vh" }}
        >
          <FaInfoCircle size="2.5vh" />
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavBar;
