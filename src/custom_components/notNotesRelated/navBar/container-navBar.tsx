import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import NavBarView from "./screen-navBar";

interface NavBarContainerProps {
  setSearchQuery: (query: string) => void;
}

const NavBarContainer: React.FC<NavBarContainerProps> = ({ setSearchQuery }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tempSearch, setTempSearch] = useState("");
  const { t } = useTranslation();

  const noteID =
    location.pathname.split("/")[location.pathname.split("/").length - 1];
    const isAlreadyLoggedIn = !location.pathname.includes("Home");


  const handleImpressumClick = () => {
    if (isAlreadyLoggedIn) {
      navigate("/settings");
    } else {
      navigate("/settingsHome");
    }
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
    if (noteID && window.confirm(t('navbar_deleteBtn'))) {
      localStorage.removeItem(noteID!);
      navigate(-1);
    }
  };

  return (
    <NavBarView
      tempSearch={tempSearch}
      showBackButton={location.pathname.includes("/datenschutz") ||
                      location.pathname.includes("/impressum") ||
                      location.pathname.includes("/settings") ||
                      location.pathname.includes("/settingsHome") ||
                      location.pathname.includes("/edit")}
      showDeleteBtn={location.pathname.includes("/edit")}
      onBackClick={handleBackClick}
      onDeleteClick={handleDelete}
      onImpressumClick={handleImpressumClick}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSubmit}
      t={t}
    />
  );
};

export default NavBarContainer;
