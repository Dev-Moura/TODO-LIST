import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [editTitle, setEditTitle] = useState(todo.text);
  const [editDescription, setEditDescription] = useState(todo.Description);

  const theme = useTheme();

  const priorityColor = {
    Imediato: "#ff6a70",
    Urgente: "#ffc067",
    Normal: "#80d8ff",
  }[todo.Priority];

  const handleOpenEdit = () => {
    setEditTitle(todo.text);
    setEditDescription(todo.Description);
    setOpenEdit(true);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
    setOpenDelete(false);
  };
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const createdAtText = todo.createdAt
    ? new Date(todo.createdAt).toLocaleString("pt-BR")
    : "";
  return (
    <>
      <ListItem
        sx={{
          backgroundColor: priorityColor,
          borderRadius: 2,
          mb: 1,
          wordBreak: "break-word",
        }}
        secondaryAction={
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton edge="end" color="primary" onClick={handleOpenEdit}>
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="error"
              onClick={() => setOpenDelete(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        }
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
        </ListItemIcon>

        <ListItemText
          primary={todo.text}
          secondary={`Descrição: ${todo.Description}
Prioridade: ${todo.Priority}
Adicionado em ${createdAtText}`}
          sx={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed
              ? theme.palette.text.disabled
              : theme.palette.text.secondary,
            "& .MuiTypography-body2": {
              color: todo.completed
                ? theme.palette.text.disabled
                : theme.palette.text.secondary,
            },
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        />
      </ListItem>

      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Excluir tarefa recorrente</DialogTitle>
        <DialogContent>Você quer mesmo excluir está tarefa</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDelete(false)}
            color="primary"
            variant="contained"
          >
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar tarefa</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Título da Tarefa"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            label="Nova descrição"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenEdit(false)}
            sx={{
              bgcolor: "red",
              color: "#f1f1f1",
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (editTitle.trim()) {
                updateTodo(todo.id, editTitle.trim(), editDescription.trim());
                setOpenEdit(false);
              }
            }}
            color="primary"
            variant="contained"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TodoItem;
