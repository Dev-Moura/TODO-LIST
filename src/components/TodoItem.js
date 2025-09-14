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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import EditIcon from "@mui/icons-material/Edit";

function TodoItem({ todo, toggleTodo, deleteTodo, updateTodo }) {
  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const priorityColor = {
    Alta: "#ff6a70",
    Média: "#ffc067",
    Baixa: "#80d8ff",
  }[todo.Priority];

  const handleDelete = () => {
    console.log("deletando tarefa com ID", todo.id);
    deleteTodo(todo.id);
    handleClose();
  };

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
            <IconButton
              edge="end"
              color="primary"
              onClick={() => setOpenEdit(true)}
            >
              <EditIcon />
            </IconButton>
            <IconButton edge="end" color="error" onClick={handleOpen}>
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
          secondary={`Categoria: ${todo.Category} | Prioridade: ${todo.Priority} |
Adicionado em ${createdAtText}`}
          sx={{
            textDecoration: todo.completed ? "line-through" : "none",
            color: todo.completed ? "gray" : "inherit",
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
          }}
        />
      </ListItem>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Excluir tarefa recorrente</DialogTitle>
        <DialogContent>Você quer mesmo excluir está tarefa</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Deletar
          </Button>
        </DialogActions>

        {/* Campo de editar task */}
      </Dialog>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar tarefa</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            label="Nova descrição"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (editValue.trim()) {
                updateTodo(todo.id, editValue.trim()); // prop
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
