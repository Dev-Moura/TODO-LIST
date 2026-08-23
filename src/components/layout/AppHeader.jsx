/**
 * Application header — brand, global search, theme toggle and account menu,
 * following the clean Google-style top bar.
 */

import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Logo from "../common/Logo.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAppTheme } from "../../context/ThemeContext.jsx";

/**
 * Renders the sticky top application bar.
 *
 * @param {Object} props - Component props.
 * @param {() => void} props.onToggleSidebar - Opens/closes the navigation drawer.
 * @param {(query: string) => void} props.onSearchChange - Called with the
 *   (already trimmed) search text on every keystroke.
 * @returns {JSX.Element} The header element.
 */
export default function AppHeader({ onToggleSidebar, onSearchChange }) {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useAppTheme();

  /** Anchor element for the account dropdown menu. */
  const [accountAnchor, setAccountAnchor] = useState(null);

  /** Closes the account dropdown menu. */
  const closeMenu = () => setAccountAnchor(null);

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        bgcolor: "background.default",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: 1.5,
        }}
      >
        <IconButton
          onClick={onToggleSidebar}
          sx={{ display: { md: "none" } }}
          aria-label="Abrir menu"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Logo size={30} withWordmark />

        <TextField
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar tarefas…"
          size="small"
          hiddenLabel
          aria-label="Buscar tarefas"
          sx={{
            ml: "auto",
            width: { xs: "42%", sm: 320 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 24,
              bgcolor: (t) =>
                t.palette.mode === "light" ? "#e9eef6" : "#303134",
              "& fieldset": { border: "none" },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Tooltip title={mode === "light" ? "Tema escuro" : "Tema claro"}>
          <IconButton onClick={toggleMode} aria-label="Alternar tema">
            {mode === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <IconButton
          onClick={(e) => setAccountAnchor(e.currentTarget)}
          aria-label="Conta"
        >
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 15 }}
          >
            {(user?.displayName || user?.email || "?").charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={accountAnchor}
          open={Boolean(accountAnchor)}
          onClose={closeMenu}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.displayName || "Usuário"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => {
              closeMenu();
              void logout();
            }}
          >
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            Sair da conta
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}
