import React, { CSSProperties } from "react";
import { Button } from "react-bootstrap";
import { IconType } from "react-icons";

interface FloatingBtnProps {
  centered: boolean;
  icon: IconType;
  onClick: () => void;
}

const FloatingBtn: React.FC<FloatingBtnProps> = ({ centered, icon, onClick }) => {

  const positionStyle: CSSProperties = centered ? {
    position: "fixed",
    bottom: "10vw",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  } : {
    position: "fixed",
    bottom: "10vw",
    right: "0rem",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  };

  return (
    <div style={positionStyle} data-testid="floating-btnDiv" >
      <Button
        style={{
          backgroundColor: "#49454F",
          height: "4rem",
          width: "4rem",
          borderColor: "#0a58ca",
          borderRadius: '50%',
        }}
        onClick={onClick}
        data-testid="floating-btn" 
      >
        {React.createElement(icon, { size: 35 })}
      </Button>
    </div>
  );
};

export default FloatingBtn;
