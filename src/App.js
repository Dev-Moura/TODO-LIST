import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  IconButton,
  Container,
  Typography,
  TextField,
  Button,
  List,
} from "@mui/material";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { ThemeProvider } from "@mui/material/styles";

import { lightTheme, darkTheme } from "./theme";
import TodoList from "./components/TodoList";

const STORAGE_KEY = "todo_app_v1";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [filterCategory, setFilterCategory] = useState("Todas");
  const [filterPriority, setFilterPriority] = useState("Todas");

  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (erro) {
      console.error("Erro problema no localStorage: ", erro);
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
  });
  const [text, setText] = useState("");

  const filteredTodos = todos
    .filter(
      (todo) => filterCategory === "Todas" || todo.Category === filterCategory
    )
    .filter(
      (todo) => filterPriority === "Todas" || todo.Priority === filterPriority
    )
    .sort((a, b) => {
      const map = { Alta: 3, Média: 2, Baixa: 1 };
      return map[b.Priority] - map[a.Priority];
    });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (erro) {
      console.error("Erro ao salvar tarefa: ", erro);
    }
  }, [todos]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          setTodos(e.newValue ? JSON.parse(e.newValue) : []);
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addTodo = () => {
    if (!text.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      Category: filterCategory === "Todas" ? "Pessoal" : filterCategory,
      Priority: filterPriority === "Todas" ? "Média" : filterPriority,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setText("");
  };

  const updateTodo = (id, newText) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>

        <Typography variant="h4" color="primary" gutterBottom>
          To-Do
        </Typography>

        <TextField
          select
          label="Categoria"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mr: 2, width: 150, marginBottom: 2 }}
        >
          <option value="Todas">Todas</option>
          <option value="Pessoal">Pessoal</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Estudos">Estudos</option>
        </TextField>

        <TextField
          select
          label="Prioridade"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ mr: 2, width: 150, marginBottom: 2 }}
        >
          <option value="Todas">Todas</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </TextField>

        <TextField
          fullWidth
          label="Nova tarefa"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={addTodo}
          sx={{ mt: 2, mb: 2 }}
        >
          Adicionar
        </Button>

        <List>
          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        </List>
      </Container>
    </ThemeProvider>
  );
}

export default App;
