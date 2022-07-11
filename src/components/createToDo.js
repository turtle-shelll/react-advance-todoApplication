import React, { useState } from "react";
import { useDispatch } from "react-redux/es/exports";
import { addTodo, hideAddTodoPage } from "../configureStore/storeSlice";
import "../stylesSheet/createToDo.css";
const tagSet = new Set();

function CreateToDo() {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [status, setStatus] = useState("open");

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimTitle = title.trim();
    const trimDescription = description.trim();
    if (trimTitle.length > 0 && trimDescription.length > 0) {
      const createAt = new Date().getTime();

      const duedate = new Date(datetime).getTime();

      if (createAt >= duedate) {
        alert("Due date & time must be greater then create time");
        return;
      }
      // const minute = 1000 * 60;
      // const hour = minute * 60;
      // const day = hour * 24;
      // const week = day * 7;
      // or we can to all calculation in one line of code like this below:
      const miliSecondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
      if (createAt + miliSecondsInOneWeek <= duedate) {
        alert("Duedate time must be less then one week.");
        return;
      }
      const key = Math.round(Math.random() * 10000);
      const data = {
        key,
        status,
        createAt,
        title: trimTitle,
        description: trimDescription,
        tag: [...tagSet],
        duedate,
      };
      dispatch(addTodo(data));
      handleHide();
    }
  };

  const handleRemoveTag = (e) => {
    e.preventDefault();
    const span = e.target;
    const perent = e.target.parentElement;
    const tagData = span.hasAttribute("data") ? span.getAttribute("data") : "";
    tagSet.delete(tagData);
    perent.className = "span_tag_for_label";
  };
  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = e.target;
    const perent = e.target.parentElement;
    const tagData = tag.hasAttribute("data") ? tag.getAttribute("data") : "";
    tagSet.add(tagData);
    perent.className = "tags_for_todo_active";
  };
  const handleHide = () => {
    setTitle("");
    setDescription("");
    setStatus("open");
    tagSet.clear();
    dispatch(hideAddTodoPage());
  };
  return (
    <div className="create_container">
      <h2>Create Todo</h2>
      <div className="create_form_container">
        <form>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              required
              type="text"
              value={title}
              placeholder="Enter title"
              onChange={(e) => setTitle(e.target.value)}
              name="title"
              id="title"
              maxLength={100}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              required
              type="text"
              value={description}
              placeholder="Enter description"
              onChange={(e) => setDescription(e.target.value)}
              name="description"
              id="description"
              maxLength={1000}
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">
              status <span>(optional)</span>
            </label>
            <select
              name="status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open" defaultChecked>
                Open
              </option>
              <option value="working">Working</option>
              <option value="done">Done</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="duedate">
              Due Date <span>(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={datetime}
              placeholder="Enter duedate"
              onChange={(e) => setDatetime(e.target.value)}
              name="duedate"
              id="duedate"
            />
          </div>
          <div className="form_group_for_tagset">
            <span className="span_tag_for_label">
              <span
                className="tags_for_todo"
                data="intraday"
                onClick={handleAddTag}
              >
                Intraday
              </span>
              <span
                data="intraday"
                className="tags_for_todo_close"
                onClick={handleRemoveTag}
              >
                x
              </span>
            </span>
            <span className="span_tag_for_label">
              <span
                className="tags_for_todo"
                data="loss"
                onClick={handleAddTag}
              >
                Loss
              </span>
              <span
                data="loss"
                className="tags_for_todo_close"
                onClick={handleRemoveTag}
              >
                x
              </span>
            </span>
            <span className="span_tag_for_label">
              <span className="tags_for_todo" data="ROI" onClick={handleAddTag}>
                ROI
              </span>
              <span
                data="ROI"
                className="tags_for_todo_close"
                onClick={handleRemoveTag}
              >
                x
              </span>
            </span>
            <span className="span_tag_for_label">
              <span
                className="tags_for_todo"
                data="profite"
                onClick={handleAddTag}
              >
                Profite
              </span>
              <span
                data="profite"
                className="tags_for_todo_close"
                onClick={handleRemoveTag}
              >
                x
              </span>
            </span>
          </div>
          <span className="btn_box">
            <div className="backBtn" onClick={handleHide}>
              Go back
            </div>
            <div className="addButton" onClick={handleSubmit}>
              add todo
            </div>
          </span>
        </form>
      </div>
    </div>
  );
}

export default CreateToDo;
