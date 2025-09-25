import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

function AddTaskDialog({
  open,
  onClose,
  text,
  setText,
  description,
  setDescription,
  priority,
  setPriority,
  onAdd,
}) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle
        sx={{ bgcolor: theme.palette.primary.dark, color: "#f5f5f5" }}
      >
        Descreva sua tarefa
      </DialogTitle>
      <DialogContent sx={{ bgcolor: "#f5f5f5" }}>
        <TextField
          fullWidth
          label="Título da Tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        <TextField
          select
          fullWidth
          label="Prioridade"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mt: 2, color: theme.palette.primary.light }}
        >
          <option value="Normal">Normal</option>
          <option value="Urgente">Urgente</option>
          <option value="Imediato">Imediato</option>
        </TextField>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "#f5f5f5" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "red",
            color: "#f1f1f1",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onAdd();
            onClose();
          }}
          variant="contained"
        >
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskDialog;
