import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  IconButton,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Footer from "./components/footer/Footer";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { ThemeProvider } from "@mui/material/styles";

import { lightTheme, darkTheme } from "./theme";
import TodoList from "./components/TodoList";

const STORAGE_KEY = "todo_app_v1";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [Description, setDescription] = useState("");
  const [Priority, setPriority] = useState("Normal");

  const [newTask, setNewTask] = useState(false);

  const handleOpenTask = () => setNewTask(true);
  const handleCloseTask = () => setNewTask(false);

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
      Description: Description,
      Priority: Priority,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setText("");
    setDescription("");
    setPriority("Normal");
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

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

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
        <Dialog open={newTask} onClose={handleCloseTask} fullWidth>
          <DialogTitle>Descreva sua tarefa</DialogTitle>
          <DialogContent>
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
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mt: 2 }}
            />

            <TextField
              select
              fullWidth
              label="Prioridade"
              value={Priority}
              onChange={(e) => setPriority(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mt: 2 }}
            >
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
              <option value="Imediato">Imediato</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseTask}>Cancelar</Button>
            <Button
              onClick={() => {
                addTodo();
                handleCloseTask();
              }}
              variant="contained"
            >
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenTask}
          sx={{ mb: 2 }}
        >
          Nova Tarefa
        </Button>
        <List>
          <TodoList
            todos={pendingTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        </List>

        {completedTodos.length > 0 && (
          <Box
            sx={{
              mt: 4,
              p: 2,
              border: "1px solid #ccc",
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              Tarefas Concluídas
            </Typography>
            <TodoList
              todos={completedTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          </Box>
        )}
      </Container>
      <Footer />
    </ThemeProvider>
  );
}

export default App;
