/**
 * Navigation sidebar — task views (all, by priority, completed) in a
 * Google-Tasks-like persistent/temporary drawer.
 */

import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ListAltRoundedIcon from "@mui/icons-material/ListAltRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Logo from "../common/Logo.jsx";
import { PRIORITIES } from "../../constants/priority";

/** Width of the permanent (desktop) drawer in pixels. @type {number} */
const DRAWER_WIDTH = 264;

/**
 * Builds the list of navigation entries rendered inside the drawer.
 *
 * @param {Array<{id: string, label: string, count: number}>} counts - Pending
 *   and completed counters keyed by view id (`"all"` or priority value).
 * @param {import("../../constants/priority").PriorityValue|"all"|"completed"} view - Currently selected view.
 * @returns {JSX.Element} The drawer content.
 */
function DrawerContent({ view, onSelectView, pendingCount, completedCount }) {
  return (
    <Box role="presentation">
      <Box sx={{ px: 3, py: 2.5 }}>
        <Logo size={30} withWordmark />
      </Box>
      <Divider />

      <List sx={{ px: 1.5, pt: 1.5 }}>
        <ListItemButton
          selected={view === "all"}
          onClick={() => onSelectView("all")}
          sx={{ borderRadius: 999 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ListAltRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Minhas tarefas" />
          <Typography variant="body2" color="text.secondary">
            {pendingCount}
          </Typography>
        </ListItemButton>

        {PRIORITIES.map((p) => (
          <ListItemButton
            key={p.value}
            selected={view === p.value}
            onClick={() => onSelectView(p.value)}
            sx={{ borderRadius: 999 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <FlagRoundedIcon sx={{ color: p.color }} />
            </ListItemIcon>
            <ListItemText primary={p.label} />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 1 }} />

        <ListItemButton
          selected={view === "completed"}
          onClick={() => onSelectView("completed")}
          sx={{ borderRadius: 999 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <CheckCircleOutlineRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Concluídas" />
          <Typography variant="body2" color="text.secondary">
            {completedCount}
          </Typography>
        </ListItemButton>
      </List>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ position: "absolute", bottom: 12, left: 24 }}
      >
        Listo · v1.0
      </Typography>
    </Box>
  );
}

/**
 * Renders the app sidebar: a fixed drawer on desktop and a temporary one on
 * small screens.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.mobileOpen - Whether the temporary drawer is open.
 * @param {() => void} props.onMobileClose - Closes the temporary drawer.
 * @param {"all"|import("../../constants/priority").PriorityValue|"completed"} props.view - Active view id.
 * @param {(view: "all"|import("../../constants/priority").PriorityValue|"completed") => void} props.onSelectView - View change handler.
 * @param {number} props.pendingCount - Number of pending tasks.
 * @param {number} props.completedCount - Number of completed tasks.
 * @returns {JSX.Element} The sidebar element(s).
 */
export default function AppSidebar({
  mobileOpen,
  onMobileClose,
  view,
  onSelectView,
  pendingCount,
  completedCount,
}) {
  return (
    <>
      {/* Permanent drawer — hidden below the `md` breakpoint. */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            bgcolor: "background.default",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <DrawerContent
          view={view}
          onSelectView={onSelectView}
          pendingCount={pendingCount}
          completedCount={completedCount}
        />
      </Drawer>

      {/* Temporary drawer for small screens. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            bgcolor: "background.paper",
          },
        }}
      >
        <DrawerContent
          view={view}
          onSelectView={(v) => {
            onSelectView(v);
            onMobileClose();
          }}
          pendingCount={pendingCount}
          completedCount={completedCount}
        />
      </Drawer>
    </>
  );
}
