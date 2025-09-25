import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

function Header() {
  const theme = useTheme();
  return (
    <AppBar position="static" sx={{ bgcolor: theme.palette.primary.dark }}>
      <Toolbar>
        <Box component="header" sx={{ mr: 2 }} />
        <Typography
          variant="h4"
          component="div"
          color="secondary"
          sx={{ flexGrow: 1 }}
        >
          To-Do List
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
