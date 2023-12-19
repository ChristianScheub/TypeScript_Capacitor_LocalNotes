import React, { useState } from "react";
import { Navbar, Container, Button, Form, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { Capacitor } from '@capacitor/core';



interface NavBarProps {
  setSearchQuery: (query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setSearchQuery }) => {
  const navigate = useNavigate();
  const [tempSearch, setTempSearch] = useState("");
  const location = useLocation();
  const isIOS = Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';

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
        position: "fixed",
        top: 0,
        width: "100%",
        backgroundColor: "#161616",
        borderBottom: "1px solid #6c757d",
        paddingTop: isIOS ? '10vw' : '0',
      }}
    >
      <Container>
        {showBackButton ? (
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
