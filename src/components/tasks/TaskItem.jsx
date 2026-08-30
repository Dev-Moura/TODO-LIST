/**
 * Task item — a Google-Tasks-style row with a round checkbox, expandable
 * details (description, priority chip, created date) and edit/delete actions.
 */

import { useState } from "react";
import {
  Box,
  Checkbox,
  Chip,
  Collapse,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { getPriority } from "../../constants/priority";

/**
 * Formats a millisecond timestamp as a short pt-BR date.
 * @param {number|null} [ms] - Timestamp in milliseconds since epoch.
 * @returns {string} Human-readable date, or an empty string when absent.
 */
function formatDate(ms) {
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Renders a single task row.
 *
 * @param {Object} props - Component props.
 * @param {import("../../hooks/useTasks").Task} props.task - The task to render.
 * @param {() => void} props.onToggle - Called when the checkbox is clicked.
 * @param {() => void} props.onEdit - Opens the task in the edit dialog.
 * @param {() => void} props.onDelete - Deletes the task (with undo support).
 * @returns {JSX.Element} The task row element.
 */
export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  /** Whether the row can be expanded (has extra info to show). */
  const hasDetails = Boolean(task.description) || Boolean(task.createdAt);
  const priority = getPriority(task.priority);

  return (
    <ListItem
      disablePadding
      secondaryAction={
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Editar">
            <IconButton size="small" onClick={onEdit} aria-label="Editar tarefa">
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" onClick={onDelete} aria-label="Excluir tarefa">
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      }
    >
      <ListItemButton
        onClick={() => setExpanded((v) => !v)}
        dense
        sx={{ alignItems: "flex-start", py: 1.25, pr: 12 }}
      >
        <ListItemIcon sx={{ minWidth: 44, mt: 0.25 }}>
          <Checkbox
            edge="start"
            size="small"
            checked={task.completed}
            onClick={(e) => e.stopPropagation()}
            onChange={onToggle}
            tabIndex={-1}
            disableRipple
            aria-label={task.completed ? "Reabrir tarefa" : "Concluir tarefa"}
            icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
            checkedIcon={<CheckCircleRoundedIcon fontSize="small" />}
            sx={{
              color: priority.color,
              "&.Mui-checked": { color: priority.color },
            }}
          />
        </ListItemIcon>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            noWrap={!expanded}
            sx={{
              fontWeight: 500,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "text.secondary" : "text.primary",
            }}
          >
            {task.title}
          </Typography>

          {!expanded && task.description && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {task.description}
            </Typography>
          )}

          <Collapse in={expanded} timeout="auto">
            <Stack spacing={1} sx={{ pt: 1, pb: 0.5 }}>
              {task.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {task.description}
                </Typography>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  size="small"
                  label={priority.label}
                  variant="outlined"
                  sx={{ borderColor: priority.color, color: priority.color }}
                />
                {task.createdAt && (
                  <Typography variant="caption" color="text.secondary">
                    Criada em {formatDate(task.createdAt)}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Collapse>
        </Box>

        {/* Expand affordance only when there is something to reveal. */}
        {hasDetails && (
          <ExpandMoreRoundedIcon
            fontSize="small"
            sx={{
              ml: 1,
              mt: 0.75,
              color: "text.secondary",
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform .2s",
            }}
          />
        )}
      </ListItemButton>
    </ListItem>
  );
}
