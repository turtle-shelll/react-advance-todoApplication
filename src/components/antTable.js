import React, { useState, useEffect } from "react";
import TableNav from "./TableNav";
// import { Link } from "react-router-dom";
import "../stylesSheet/anttable.css";
import { Table, Tag } from "antd";
// import "antd/dist/antd.css";
import "antd/dist/antd.min.css";
import { useSelector, useDispatch } from "react-redux";
import CreateToDo from "./createToDo";
import UpdateTodo from "./updateTodo";
import DueDateTable from "./dueDateTable";
import {
  showAddTodoPage,
  setCurrentTodo,
  deleteTodo,
  showUpdatePage,
} from "../configureStore/storeSlice";
// import { ProTable } from "@ant-design/pro-components";
// import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  DeleteFilled,
  EditFilled,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

export default function AntTable() {
  const dispatch = useDispatch();
  const { todoList, setAddTodoPage, setUpdataPage } = useSelector(
    (state) => state.todo
  );
  // const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedRows, setSelectedRows] = useState([]);
  // const [sortOrder, setSortOrder] = useState("ascend");
  // const [sortedInfo, setSortedInfo] = useState({
  //   columnKey: "",
  //   order: "",
  // });
  // const [searchColumn, setSearchColumn] = useState("");
  // const [TodoList, setTodoList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchColumnTitle, setSearchColumnTitle] = useState("title");
  // const [searchInfo, setSearchInfo] = useState([]);

  const [TodoListCopy, setTodoListCopy] = useState([]);
  useEffect(() => {
    const makeStatusOverDue = todoList.map((todo) => {
      const isDueDateTodayGone = todo.duedate < new Date().getTime();
      const thisTodo = { ...todo };
      return isDueDateTodayGone ? { ...thisTodo, status: "overdue" } : thisTodo;
    });
    setTodoListCopy(makeStatusOverDue);
  }, [todoList]);
  const [statusFilter, setStatusFilter] = useState("");
  const [title_ascending, setTitle_ascending] = useState(true);
  // const [createAt_ascending, setCreateAt_ascending] = useState(true);
  // const [stats_ascending, setStats_ascending] = useState(true);
  // const [description_ascending, setDescription_ascending] = useState(true);
  // const [search, setSearch] = useState("");

  const findDay = (timeInMiliSeconds) => {
    const day = new Date(timeInMiliSeconds).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[day];
  };
  const handleSearch = (e, valueFilter) => {
    e.preventDefault();
    const searchtext = e.target.value || valueFilter || "";
    setSearchText(e.target.value);
    const searchDataArray = todoList.filter((item) => {
      // return item[searchColumnTitle].includes(e.target.value);
      const currentTodoItem = item[searchColumnTitle].toLocaleLowerCase();
      return currentTodoItem.includes(searchtext.toLocaleLowerCase());
    });
    setTodoListCopy(searchDataArray);
  };

  const handleFilter = (filterByColumn, statusFilter) => {
    // e.preventDefault();
    console.log("searchColumnTitle", statusFilter);
    const searchDataArray = todoList.filter((item) => {
      return item[filterByColumn].includes(statusFilter);
    });
    setTodoListCopy(searchDataArray);
    console.log("searchDataArrayByColumn==", searchDataArray);
  };

  const handleFilterByDay = (filterByColumn, FilterValue) => {
    // e.preventDefault();
    console.log("searchColumnTitle", FilterValue);
    const searchDataArray = todoList.filter((item) => {
      return findDay(item[filterByColumn]).includes(FilterValue);
      // return findDay(item[filterByColumn]) === FilterValue;
    });
    setTodoListCopy(searchDataArray);
    console.log("searchDataArrayByColumn==", searchDataArray);
  };
  // searching and sorting by filter function
  const handleStatusFilteredSort = (filterByColumn, statusFilter) => {
    setTitle_ascending(true);
    handleFilter(filterByColumn, statusFilter);
  };
  const sortTodo = (array, filterName) => {
    const newArray = [...array];
    const filter = filterName;
    const sortedTodo = newArray.sort((a, b) => {
      if (a[filter] < b[filter]) {
        return -1;
      }
      if (a[filter] > b[filter]) {
        return 1;
      }
      return 0;
    });
    if (title_ascending) {
      setTodoListCopy(sortedTodo);
    } else {
      setTodoListCopy(sortedTodo.reverse());
    }
  };

  const currentTodo = (todoKey) => {
    dispatch(setCurrentTodo(todoKey));
    dispatch(showUpdatePage());
  };
  const handleDelete = (todoKey) => {
    dispatch(setCurrentTodo(todoKey));
    dispatch(deleteTodo(todoKey));
  };

  const createAtTable = (timeInMiliSeconds) => {
    return (
      <>
        <div>
          {new Date(timeInMiliSeconds).getDate() === new Date().getDate()
            ? "Today"
            : findDay(timeInMiliSeconds)}
        </div>
        <div>{`${new Date(timeInMiliSeconds).getHours()}:${new Date(
          timeInMiliSeconds
        ).getMinutes()}`}</div>
      </>
    );
  };
  const sortTodoByNameOfContainer = (filterName, tableHeaderName) => {
    const spanElement = document.querySelector(`.${tableHeaderName} span`);
    const spanElement2 = document.querySelector(
      `.${tableHeaderName} span:nth-child(2)`
    );
    if (title_ascending) {
      sortTodo(todoList, filterName);
      spanElement2.className = "span_show";
      spanElement.className = "span_hide";
      setTitle_ascending(false);
    } else {
      sortTodo(todoList, filterName);
      spanElement.className = "span_show";
      spanElement2.className = "span_hide";
      setTitle_ascending(true);
    }
  };

  const filterByTag = (tag) => {
    const dataArray = [...todoList];
    const fiteredData = dataArray.filter((todo) => {
      if (tag === "all") return true;
      return todo.tag.includes(tag);
    });
    setTodoListCopy(fiteredData);
  };

  const Coulmun = [
    {
      title: () => {
        return (
          <div className="table_status_Container">
            <select
              name="filter"
              id="table_status_fitler"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                handleStatusFilteredSort("status", e.target.value);
              }}
            >
              <option value="" default>
                all
              </option>
              <option value="open">Open</option>
              <option value="working">Working</option>
              <option value="done">Done</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        );
      },
      dataIndex: "status",
      key: "key",
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
                handleFilterByDay("createAt", e.target.value);
              }}
            >
              <option value="" default>
                Time
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
      dataIndex: "createAt",
      key: "key",
      render: (createAt) => createAtTable(createAt),
    },
    {
      title: () => {
        return (
          <div
            className="table_title_Container"
            onClick={() =>
              sortTodoByNameOfContainer("title", "table_title_Container")
            }
          >
            Title
            <span>
              <DownOutlined />
            </span>
            <span className="span_hide">
              <UpOutlined />
            </span>
          </div>
        );
      },
      dataIndex: "title",
      key: "key",
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
      title: () => {
        return (
          <div
            className="table_description_Container"
            onClick={() =>
              sortTodoByNameOfContainer(
                "description",
                "table_description_Container"
              )
            }
          >
            Description
            <span>
              <DownOutlined />
            </span>
            <span className="span_hide">
              <UpOutlined />
            </span>
          </div>
        );
      },
      dataIndex: "description",
      key: "key",
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
      title: "Tags",
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

  return (
    <div className="ant_container">
      <TableNav filterByTag={filterByTag} />
      <div className="header_container">
        <div className="input-box">
          <div className="form-box_select_search_type">
            <select
              name="filter"
              id="filter"
              value={searchColumnTitle}
              onChange={(e) => setSearchColumnTitle(e.target.value)}
            >
              <option value="title" default>
                Title
              </option>
              <option value="description">Description</option>
            </select>
          </div>
          <div className="form-box-for-search">
            <span className="search_search_icon">
              <SearchOutlined />
            </span>
            <input
              id="search"
              type="text"
              placeholder="Search"
              value={searchText}
              onFocus={() => {
                const secondSpanElement = document.querySelector(
                  ".form-box-for-search .span_hide"
                );
                secondSpanElement.className = "search_close_icon";
              }}
              onBlur={() => {
                const secondSpanElement = document.querySelector(
                  ".form-box-for-search .search_close_icon"
                );
                secondSpanElement.className = "span_hide";
              }}
              // onChange={(e) => setSearchText(e.target.value)}
              onChange={handleSearch}
            />
            <span className="span_hide">
              <CloseCircleOutlined />
            </span>
          </div>
          <span
            className="createTodo"
            onClick={() => dispatch(showAddTodoPage())}
          >
            Create Todo
          </span>
        </div>
      </div>
      {setAddTodoPage && <CreateToDo />}
      {setUpdataPage && <UpdateTodo />}
      <div className="table_container">
        <DueDateTable />
      </div>
      <div className="table_container_for_main_table">
        <h2>Todo List</h2>
        <Table
          dataSource={TodoListCopy}
          columns={Coulmun}
          className="main_table"
        ></Table>
      </div>
    </div>
  );
}
