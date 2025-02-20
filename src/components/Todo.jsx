import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function Todo(props) {
  // Firestore services (add / delete / read / mark as completed)
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);

  // Add a new todo
  const handleAddTodo = async () => {
    if (!todoText.trim()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "todos"), {
          text: todoText,
          completed: false,
          userId: user.uid,
          createdAt: serverTimestamp(),
        });
        console.log("Todo added successfully!");
        setTodoText("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Fetch todos for the current user
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todosData = [];
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() });
        });
        console.log("Fetched todos:", todosData); // Debugging
        setTodos(todosData);
      });
      return () => unsubscribe();
    }
  }, [handleAddTodo]); // Fixed: No dependencies

  // Mark a todo as completed
  const handleCompleteTodo = async (todoId) => {
    try {
      const todoRef = doc(db, "todos", todoId);
      await updateDoc(todoRef, { completed: true });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteDoc(doc(db, "todos", todoId));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  return (
    <div className="main">
      <h1>Todo App</h1>
      <button onClick={props.onClickSignOut} className="signOut">
        Sign Out
      </button>
      <div className="input-field">
        <input
          id="Addtodo"
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>

      <ul className="todos">
        {todos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                wordWrap: "break-word",
                maxWidth: "50%",
              }}
            >
              {todo.text}
            </span>
            <div>
              <button
                className="complete"
                onClick={() => handleCompleteTodo(todo.id)}
              >
                Complete
              </button>
              <button
                className="delete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
