import React from "react";
import { List } from "@mui/material";
import TodoItem from "./TodoItem";

function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
  filteredTodos,
}) {
  return (
    <List>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
          filteredTodos={filteredTodos}
        />
      ))}
    </List>
  );
}
export default TodoList;
