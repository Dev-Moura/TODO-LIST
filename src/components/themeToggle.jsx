import React from "react";
import { IconButton } from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </div>
  );
}

export default ThemeToggle;
