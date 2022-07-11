import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  setAddTodoPage: false,
  setUpdataPage: false,
  isError: false,
  todoList: [],
  currentTodo: null,
};
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    showUpdatePage: (state) => {
      state.setUpdataPage = true;
    },
    hideUpdatePage: (state) => {
      state.setUpdataPage = false;
    },
    showAddTodoPage: (state, action) => {
      state.setAddTodoPage = true;
    },
    hideAddTodoPage: (state, action) => {
      state.setAddTodoPage = false;
    },
    addTodo: (state, action) => {
      state.todoList.unshift(action.payload);
    },
    deleteTodo: (state, action) => {
      const currentIndex = state.todoList.findIndex(
        (todo) => todo.key === action.payload
      );
      state.todoList.splice(currentIndex, 1);
    },
    editTodo: (state, action) => {
      const updataTodo = state.todoList.map((todo) => {
        if (todo.key === action.payload.key) {
          return action.payload;
        }
        return todo;
      });
      state.todoList = updataTodo;
      state.currentTodo = null;
      //   state.todoList[action.payload.index] = action.payload.todo;
    },
    setCurrentTodo: (state, action) => {
      const currentTodo = state.todoList.filter(
        (todo) => todo.key === action.payload
      );
      state.currentTodo = currentTodo;
      // state.setUpdataPage = true;
    },
  },
});

export const {
  addTodo,
  deleteTodo,
  editTodo,
  setCurrentTodo,
  showAddTodoPage,
  hideAddTodoPage,
  showUpdatePage,
  hideUpdatePage,
} = todoSlice.actions;

export default todoSlice.reducer;
