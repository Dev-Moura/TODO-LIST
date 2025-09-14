import React, { use, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Category } from "@mui/icons-material";

function TodoForm({ addTodo }) {
  const [value, setValue] = useState("");

  const [Category, setCategory] = useState("Pessoal");
  const [priority, setPriority] = useState("Média");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} mt={2}>
      <TextField
        select
        label="Categoria"
        value={Category}
        onChange={(e) => setCategory(e.target.value)}
        selectProps={{ native: true }}
        sx={{ width: 150 }}
      >
        <option value="Pessoal">Pessoal</option>
        <option value="Trabalho">Trabalho</option>
        <option value="Estudo">Estudo</option>
      </TextField>
      <TextField
        select
        label="Prioridade"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        SelectProps={{ native: true }}
        sx={{ width: 150 }}
      >
        <option value="Baixa">Baixa</option>
        <option value="Média">Média</option>
        <option value="alta">Alta</option>
      </TextField>

      <TextField
        fullWidth
        label="Nova tarefa"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        variant="outlined"
      />
      <Button type="submit" variant="contained" color="primary">
        <AddIcon />
      </Button>
    </Box>
  );
}

export default TodoForm;
