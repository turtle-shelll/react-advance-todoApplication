import React, { useState, useEffect } from "react";
import "../stylesSheet/dueDateTable.css";
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentTodo,
  showUpdatePage,
  deleteTodo,
} from "../configureStore/storeSlice";
import {
  DeleteFilled,
  EditFilled,
  //   SearchOutlined,
  //   UpOutlined,
  //   DownOutlined,
  //   CloseCircleOutlined,
} from "@ant-design/icons";

function DueDateTable() {
  const dispatch = useDispatch();
  const { todoList } = useSelector((state) => state.todo);

  const [hasDueDateTodoList, setHasDueDateTodoList] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [TodoListCopy, setTodoListCopy] = useState([]);
  const [showDueDateTable, setShowDueDateTable] = useState(true);

  useEffect(() => {
    const hasDueDateTodoList = todoList.filter((todo) => {
      //   return todo.duedate !== undefined && todo.duedate !== NaN;
      return todo.duedate !== undefined && isNaN(todo.duedate) === false;
    });
    const nearestDueDateSort = sortTodo(hasDueDateTodoList, "duedate");
    const makeStatusOverDue = nearestDueDateSort.map((todo) => {
      const isDueDateTodayGone = todo.duedate < new Date().getTime();
      const thisTodo = { ...todo };
      return isDueDateTodayGone ? { ...thisTodo, status: "overdue" } : thisTodo;
    });

    setHasDueDateTodoList(makeStatusOverDue);
    setTodoListCopy(makeStatusOverDue);
    const nearestDueDateByToday = nearestDueDateSort[0]?.duedate;

    const isDueDateToday =
      new Date(nearestDueDateByToday).getDate() === new Date().getDate();
    setHeaderWorning(isDueDateToday);
  }, [todoList]);

  const sortTodo = (array, filterName) => {
    const newArray = [...array];
    const filter = filterName;
    const sortedTodo = newArray.sort((a, b) => {
      const isDueDateTodayGone = a.duedate > new Date().getTime();
      const thisA = isDueDateTodayGone ? { ...a, status: "overdue" } : a;
      if (thisA[filter] < b[filter]) {
        return -1;
      }
      if (thisA[filter] > b[filter]) {
        return 1;
      }
      return 0;
    });
    return sortedTodo;
  };
  const handleFilterByDay = (filterByColumn, FilterValue) => {
    const searchDataArray = hasDueDateTodoList.filter((item) => {
      return findDay(item[filterByColumn]).includes(FilterValue);
    });
    const nearestDueDateSort = sortTodo(searchDataArray, "duedate");
    setTodoListCopy(nearestDueDateSort);
  };

  const findDay = (timeInMiliSeconds) => {
    const day = new Date(timeInMiliSeconds).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[day];
  };

  const setHeaderWorning = (trueValue) => {
    if (trueValue) {
      const header = document.querySelector(".due_date_table_header");
      header.style.backgroundColor = "lightsalmon";
      header.style.border = "1px solid salmon";
    } else {
      const header = document.querySelector(".due_date_table_header");
      header.style.backgroundColor = "#f5f5f5";
      header.style.border = "none";
      header.style.borderBottom = "1px solid #b6b6b6";
    }
  };

  const createAtTable = (timeInMiliSeconds) => {
    return (
      <>
        <div className="duedate_time">
          {new Date(timeInMiliSeconds).getDate() === new Date().getDate() ? (
            <span
              className="duedate_time"
              style={{ color: "red", marginLeft: "-0.1rem" }}
            >
              Today
            </span>
          ) : (
            findDay(timeInMiliSeconds) +
            "/" +
            new Date(timeInMiliSeconds).getDate()
          )}
        </div>
        <div>{`${new Date(timeInMiliSeconds).getHours()}:${new Date(
          timeInMiliSeconds
        ).getMinutes()}`}</div>
      </>
    );
  };

  const currentTodo = (todoKey) => {
    dispatch(setCurrentTodo(todoKey));
    dispatch(showUpdatePage());
  };
  const handleDelete = (todoKey) => {
    dispatch(setCurrentTodo(todoKey));
    dispatch(deleteTodo(todoKey));
  };
  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "kay",
      render: (status) => {
        return (
          <span
            className={status === "overdue" ? "status_overdue" : "status_all"}
          >
            {status}
          </span>
        );
      },
    },
    {
      title: () => {
        return (
          <div className="table_createAt_Container">
            <select
              name="filter"
              id="table_createAt_fitler"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleFilterByDay("duedate", e.target.value);
              }}
            >
              <option value="" default>
                Due Date
              </option>
              <option value="Sun">Sun</option>
              <option value="Mon">Mon</option>
              <option value="Tue">Tue</option>
              <option value="Wed">Wed</option>
              <option value="Thu">Thu</option>
              <option value="Fri">Fri</option>
              <option value="Sat">Sat</option>
            </select>
          </div>
        );
      },
      dataIndex: "duedate",
      key: "key",
      render: (duedate) => createAtTable(duedate),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "kay",
      render: (title) => {
        return (
          <div className="table_Title_box">
            <span className="table_title_container_span">
              <div className="table_title_container_div">{title}</div>
              Read more...
            </span>
          </div>
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "kay",
      render: (description) => {
        return (
          <div className="table_description_container">
            <span className="table_description_container_span">
              <div className="table_description_container_div">
                {description}
              </div>
              Read more...
            </span>
          </div>
        );
      },
    },

    {
      title: "Tag",
      dataIndex: "tag",
      key: "key",
      render: (tag) => {
        return (
          <div className="data_tag_container">
            {tag.map((tag) => {
              return (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </div>
        );
      },
    },

    {
      title: "action",
      dataIndex: "key",
      key: "key",
      render: (dataIndex) => (
        <div className="action-container" key={dataIndex}>
          <EditFilled
            onClick={() => currentTodo(dataIndex)}
            style={{ color: "lightseagreen" }}
          />
          <DeleteFilled
            onClick={() => handleDelete(dataIndex)}
            style={{ color: "lightsalmon" }}
          />
        </div>
      ),
    },
  ];

  const open_dueDate_table = () => {
    if (showDueDateTable) {
      const dueDateTableTop_container = document.querySelector(
        ".DueDateTable_top_container"
      );
      dueDateTableTop_container.style.height = "fit-content";
      setShowDueDateTable(false);
    } else {
      const dueDateTableTop_container = document.querySelector(
        ".DueDateTable_top_container"
      );
      dueDateTableTop_container.style.height = "70px";
      setShowDueDateTable(true);
    }
  };

  return (
    <div className="DueDateTable_top_container">
      <div className="dudate_open_message">
        <div className="due_date_table_header" onClick={open_dueDate_table}>
          <h2>Duedate with sort time line.</h2>
        </div>
        <div className="due_date_table">
          <Table columns={columns} dataSource={TodoListCopy} />
        </div>
      </div>
    </div>
  );
}

export default DueDateTable;
