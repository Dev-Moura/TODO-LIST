/**
 * Task create/edit dialog — Google-Tasks-style modal with title,
 * description and priority selection.
 */

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { DEFAULT_PRIORITY, PRIORITIES } from "../../constants/priority";

/**
 * Shape of the values edited by this dialog.
 * @typedef {import("../../hooks/useTasks").TaskInput} TaskInput
 */

/**
 * Renders a modal dialog for creating or editing a task.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {() => void} props.onClose - Called when the dialog should dismiss.
 * @param {(input: TaskInput) => void} props.onSubmit - Called with the
 *   validated input when the user confirms.
 * @param {import("../../hooks/useTasks").Task|null} [props.task=null] - Task
 *   being edited, or null to create a new one.
 * @returns {JSX.Element} The dialog element.
 */
export default function TaskDialog({ open, onClose, onSubmit, task = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(DEFAULT_PRIORITY);

  // Re-seed the form whenever the dialog opens (new or existing task).
  useEffect(() => {
    if (open) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setPriority(task?.priority ?? DEFAULT_PRIORITY);
    }
  }, [open, task]);

  /**
   * Validates and submits the form, then closes the dialog.
   * @returns {void}
   */
  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description, priority });
    onClose();
  };

  /** Whether the confirm button can be pressed. */
  const canSubmit = Boolean(title.trim());

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
    >
      <DialogContent>
        <Stack spacing={2}>
          <TextField
            autoFocus
            label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            slotProps={{ input: { sx: { fontSize: "1.15rem" } } }}
          />
          <TextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            variant="standard"
          />
          <TextField
            select
            label="Prioridade"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            variant="standard"
          >
            {PRIORITIES.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: p.color,
                    }}
                  />
                  {p.label}
                </Box>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 1.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit} variant="contained">
          {task ? "Salvar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
