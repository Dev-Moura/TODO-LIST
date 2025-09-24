import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box component="header" sx={{ mr: 2 }} />
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          To-Do List
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
