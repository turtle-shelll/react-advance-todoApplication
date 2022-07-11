import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { editTodo, hideUpdatePage } from "../configureStore/storeSlice";
import "../stylesSheet/createToDo.css";

const tagSet = new Set();
const availableTag = ["intraday", "loss", "ROI", "profite"];
function CreateToDo() {
  const dispatch = useDispatch();
  const { currentTodo } = useSelector((state) => state.todo);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("open");
  const [datetime, setDatetime] = useState("");
  // const tagSet = new Set();
  if (currentTodo[0].tag.length > 0) {
    currentTodo[0].tag.forEach((tag) => {
      tagSet.add(tag);
    });
  }

  useEffect(() => {
    if (currentTodo) {
      setTitle(currentTodo[0].title);
      setDescription(currentTodo[0].description);
      setStatus(currentTodo[0].status);

      function isDate(date) {
        return date instanceof Date;
      }
      function toDate(date) {
        if (date === void 0) {
          return new Date(0);
        }
        if (isDate(date)) {
          return date;
        } else {
          return new Date(parseFloat(date.toString()));
        }
      }
      function format(date, format) {
        var d = toDate(date);
        return format
          .replace(/Y/gm, d.getFullYear().toString())
          .replace(/m/gm, ("0" + (d.getMonth() + 1)).substr(-2))
          .replace(/d/gm, ("0" + (d.getDate() + 0)).substr(-2))
          .replace(/H/gm, ("0" + (d.getHours() + 0)).substr(-2))
          .replace(/i/gm, ("0" + (d.getMinutes() + 0)).substr(-2))
          .replace(/s/gm, ("0" + (d.getSeconds() + 0)).substr(-2))
          .replace(/v/gm, ("0000" + (d.getMilliseconds() % 1000)).substr(-3));
      }
      //TEST
      // var ms = "1519073776000";
      const dateFormat = "Y-m-d H:i:s.v";
      const formatted = format(currentTodo[0].duedate, dateFormat);
      setDatetime(formatted);
    }
  }, [currentTodo]);
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimTitle = title.trim();
    const trimDescription = description.trim();

    if (trimTitle.length > 0 && trimDescription.length > 0) {
      // const createAt = new Date().getTime();
      const createAt = currentTodo[0]?.createAt;
      const duedate = new Date(datetime).getTime();
      if (createAt >= duedate) {
        alert("Due date & time must be greater then create time");
        return;
      }
      const miliSecondsInOneWeek = 1000 * 60 * 60 * 24 * 7;
      if (createAt + miliSecondsInOneWeek <= duedate) {
        alert("Duedate time must be less then one week.");
        return;
      }
      const data = {
        key: currentTodo[0].key,
        status,
        createAt: currentTodo[0].createAt,
        title: trimTitle,
        description: trimDescription,
        // tag: [...trimTag],
        tag: [...tagSet],
        duedate,
      };
      // console.log("updateTodo==", data);
      dispatch(editTodo(data));
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
    dispatch(hideUpdatePage());
  };
  return (
    <div className="create_container">
      <h2>Update Todo</h2>
      <div className="create_form_container">
        <form>
          <div className="form-group">
            <label htmlFor="title">Title</label>
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
            <label htmlFor="description">Description</label>
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
            <label htmlFor="status">status</label>
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
            {
              // useMemo(() => {return
              availableTag.map((Tag, index) => {
                // return tagSet.has(Tag) ? (
                return (
                  <span
                    className={
                      tagSet.has(Tag)
                        ? "tags_for_todo_active"
                        : "span_tag_for_label"
                    }
                    key={index}
                  >
                    <span
                      className={`tags_for_todo`}
                      data={Tag}
                      onClick={handleAddTag}
                    >
                      {Tag}
                    </span>
                    <span
                      data={Tag}
                      className="tags_for_todo_close"
                      onClick={handleRemoveTag}
                    >
                      x
                    </span>
                  </span>
                );
              })
            }
            {/* // })} */}
          </div>
          <span className="btn_box">
            <div className="backBtn" onClick={handleHide}>
              Go back
            </div>
            <div className="addButton" onClick={handleSubmit}>
              update
            </div>
          </span>
        </form>
      </div>
    </div>
  );
}

export default CreateToDo;
