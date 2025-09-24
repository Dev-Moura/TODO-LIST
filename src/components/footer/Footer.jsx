import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

function Footer() {
  const theme = useTheme();
  return (
    <Box
      component={"footer"}
      sx={{
        py: 2,
        textAlign: "center",
        bgcolor: theme.palette.background.paper,
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body1" color="secondary">
        © {new Date().getFullYear()} - Simple To-Do App by{" "}
        <a
          href="https://www.github.com/Dev-Moura/"
          style={{ textDecoration: "none", color: "secondary" }}
        >
          Michael Moura
        </a>
      </Typography>
    </Box>
  );
}

export default Footer;
