import React, { useEffect, useState } from "react";
import {
  CssBaseline,
  Container,
  Typography,
  Button,
  Box,
  List,
  TextField,
} from "@mui/material";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme";
import TodoList from "./components/todo/TodoList";
import AddTaskDialog from "./components/todo/AddTaskDialog.jsx";
import ThemeToggle from "./components/themeToggle.jsx";

const STORAGE_KEY = "todo_app_v1";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const [Priority, setPriority] = useState("Normal");

  const [Description, setDescription] = useState("");

  const [newTask, setNewTask] = useState(false);
  const [text, setText] = useState("");

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

  const handleOpenTask = () => setNewTask(true);
  const handleCloseTask = () => setNewTask(false);

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
      Description,
      Priority,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setText("");
    setDescription("");
    setPriority("Normal");
  };

  const updateTodo = (id, newTitle, newDescription) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: newTitle, Description: newDescription }
          : todo
      )
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

  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const filteredTodos = pendingTodos.filter((todo) => {
    if (priorityFilter === "Todas") return true;
    return todo.Priority === priorityFilter;
  });
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <CssBaseline />
        <Header />
        <Container maxWidth="lg" sx={{ mt: 5, flex: 1 }}>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="h4" color="primary">
              Suas Tarefas
            </Typography>

            <TextField
              select
              label="Filtrar prioridade"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              SelectProps={{ native: true }}
              size="small"
            >
              <option value="Todas">Todas</option>
              <option value="Normal">Normal</option>
              <option value="Urgente">Urgente</option>
              <option value="Imediato">Imediato</option>
            </TextField>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenTask}
            sx={{ mt: 5 }}
          >
            Nova Tarefa
          </Button>

          <AddTaskDialog
            open={newTask}
            onClose={handleCloseTask}
            text={text}
            setText={setText}
            description={Description}
            setDescription={setDescription}
            priority={Priority}
            setPriority={setPriority}
            onAdd={addTodo}
          />

          <List>
            <TodoList
              todos={filteredTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          </List>

          {completedTodos.length > 0 && (
            <Box
              sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Typography variant="h4" color="primary" gutterBottom>
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
