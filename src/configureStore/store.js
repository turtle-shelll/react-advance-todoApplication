// import { createStore, applyMiddleware } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./storeSlice";
const store = configureStore({
  reducer: {
    todo: todoReducer,
  },
});

export default store;
