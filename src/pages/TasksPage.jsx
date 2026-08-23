/**
 * Tasks page — the authenticated home screen: sidebar navigation, search,
 * Google-Tasks-style card listing, completed section and the FAB to create
 * tasks.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Fab,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import AppHeader from "../components/layout/AppHeader.jsx";
import AppSidebar from "../components/layout/AppSidebar.jsx";
import TaskDialog from "../components/tasks/TaskDialog.jsx";
import TaskItem from "../components/tasks/TaskItem.jsx";
import { getPriority } from "../constants/priority";
import { useAuth } from "../context/AuthContext.jsx";
import { useTasks } from "../hooks/useTasks";

/** Active view ids: everything, a priority filter, or completed only. @typedef {"all"|import("../constants/priority").PriorityValue|"completed"} ViewId */

/**
 * Removes diacritics and lowercases a string for accent-insensitive search.
 * @param {string} value - Raw user-facing text.
 * @returns {string} Normalized text.
 */
const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Human-friendly title for the active view.
 * @param {ViewId} view - Active view id.
 * @returns {string} The view title.
 */
function viewTitle(view) {
  if (view === "all") return "Minhas tarefas";
  if (view === "completed") return "Concluídas";
  return `Prioridade: ${getPriority(view).label}`;
}

/**
 * Renders the main (authenticated) application screen.
 *
 * @returns {JSX.Element} The tasks page element.
 */
export default function TasksPage() {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    toggleTask,
    removeTask,
    restoreTask,
    migrateLegacyTasks,
  } = useTasks(user?.uid ?? null);

  const [view, setView] = useState(/** @type {ViewId} */ ("all"));
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [snackbar, setSnackbar] = useState(/** @type {{msg: string, task?: Object}|null} */ (null));

  // One-time import of legacy localStorage tasks on first sign-in.
  useEffect(() => {
    if (!loading && user) void migrateLegacyTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  /** Pending tasks in the active view matching the search text. */
  const pending = useMemo(() => {
    const q = normalize(search.trim());
    return tasks.filter((t) => {
      if (t.completed) return false;
      if (view !== "all" && view !== "completed" && t.priority !== view)
        return false;
      if (!q) return true;
      return (
        normalize(t.title).includes(q) || normalize(t.description || "").includes(q)
      );
    });
  }, [tasks, view, search]);

  /** Completed tasks (shown in the collapsible bottom section). */
  const completed = useMemo(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

  /**
   * Opens the create dialog with a blank form.
   */
  const openCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  /**
   * Deletes a task and offers undo via snackbar.
   * @param {import("../hooks/useTasks").Task} task - Task being deleted.
   */
  const handleDelete = async (task) => {
    const removed = await removeTask(task.id);
    setSnackbar({ msg: "Tarefa excluída.", task: removed });
  };

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppHeader
        onToggleSidebar={() => setMobileOpen(true)}
        onSearchChange={setSearch}
      />

      <Box sx={{ display: { md: "flex" } }}>
        <AppSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          view={view}
          onSelectView={setView}
          pendingCount={tasks.filter((t) => !t.completed).length}
          completedCount={completed.length}
        />

        <Box component="main" sx={{ flex: 1, px: { xs: 2, sm: 4 }, py: 4 }}>
          <Paper
            elevation={0}
            sx={{
              maxWidth: 720,
              mx: "auto",
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <Box sx={{ px: 3, pt: 3 }}>
              <Typography variant="h5">{viewTitle(view)}</Typography>
              <Typography variant="body2" color="text.secondary">
                {pending.length} {pending.length === 1 ? "tarefa pendente" : "tarefas pendentes"}
                {search ? " · resultados da busca" : ""}
              </Typography>
            </Box>

            {/* Task list / empty state */}
            <Box sx={{ px: 1.5, pb: 1.5, minHeight: 120 }}>
              {pending.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => void toggleTask(task)}
                  onEdit={() => {
                    setEditingTask(task);
                    setDialogOpen(true);
                  }}
                  onDelete={() => void handleDelete(task)}
                />
              ))}

              {!loading && pending.length === 0 && (
                <Box textAlign="center" py={8}>
                  <CheckCircleOutlineRoundedIcon
                    color="success"
                    sx={{ fontSize: 56, mb: 1 }}
                  />
                  <Typography variant="body1">
                    {search ? "Nada encontrado." : "Tudo em ordem por aqui!"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {search
                      ? "Tente outro termo de busca."
                      : "Toque no botão + para criar sua primeira tarefa."}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Completed — collapsible footer inside the card */}
            {view !== "completed" && completed.length > 0 && (
              <Box sx={{ borderTop: "1px solid", borderColor: "divider" }}>
                <Button
                  fullWidth
                  color="inherit"
                  onClick={() => setShowCompleted((v) => !v)}
                  startIcon={
                    showCompleted ? (
                      <KeyboardArrowUpRoundedIcon />
                    ) : (
                      <KeyboardArrowDownRoundedIcon />
                    )
                  }
                  sx={{
                    justifyContent: "flex-start",
                    px: 3,
                    py: 1.5,
                    textTransform: "none",
                  }}
                >
                  Concluídas ({completed.length})
                </Button>
                <Collapse in={showCompleted}>
                  <Box sx={{ px: 1.5, pb: 1.5 }}>
                    {completed.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={() => void toggleTask(task)}
                        onEdit={() => {
                          setEditingTask(task);
                          setDialogOpen(true);
                        }}
                        onDelete={() => void handleDelete(task)}
                      />
                    ))}
                  </Box>
                </Collapse>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Create-task FAB */}
      <Fab
        color="primary"
        aria-label="Nova tarefa"
        onClick={openCreate}
        sx={{ position: "fixed", right: 24, bottom: 24, borderRadius: 5 }}
      >
        <AddRoundedIcon />
      </Fab>

      {/* Create/edit dialog */}
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={editingTask}
        onSubmit={(input) =>
          editingTask
            ? updateTask(editingTask.id, input)
            : addTask(input)
        }
      />

      {/* Delete confirmation with undo */}
      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        message={snackbar?.msg}
        action={
          snackbar?.task && (
            <Button
              color="inherit"
              onClick={async () => {
                await restoreTask(snackbar.task);
                setSnackbar(null);
              }}
            >
              Desfazer
            </Button>
          )
        }
      />
    </Box>
  );
}
