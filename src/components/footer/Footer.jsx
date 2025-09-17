import React from "react";
import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      component={"footer"}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        py: 2,
        textAlign: "center",
        bgcolor: "#006060",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body1" color="secondary">
        © {new Date().getFullYear()} - Simple To-Do App by{" "}
        <a href="https://www.github.com/Dev-Moura/">Michael Moura</a>
      </Typography>
    </Box>
  );
}

export default Footer;
