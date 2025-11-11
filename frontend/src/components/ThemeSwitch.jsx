import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <StyledWrapper>
      <div className="toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider" />
        </label>
      </div>
    </StyledWrapper>
  );
};

export default ThemeSwitch;

const StyledWrapper = styled.div`
  display: inline-flex !important;
  width: fit-content !important;
  max-width: fit-content !important;
  padding: 0 !important;
  margin: 0 !important;

  .toggle-switch {
    position: relative;
    width: 50px;
    height: 23px;
    --light: #d8dbe0;
    --dark: #28292c;
  }

  .switch-label {
    position: absolute;
    width: 100%;
    height: 23px;
    background-color: var(--dark);
    border-radius: 15px;
    cursor: pointer;
    border: 2px solid var(--dark);
  }

  .checkbox {
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 15px;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 1px;
    left: 4px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background-color: var(--dark);
    box-shadow: inset 8px -3px 0px 0px var(--light);
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider::before {
    transform: translateX(25px);
    background-color: var(--dark);
    box-shadow: none;
  }
`;
