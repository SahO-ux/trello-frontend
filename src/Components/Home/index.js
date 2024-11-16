import React, { useState, useEffect, useCallback, useRef } from "react";
import { debounce } from "lodash";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  getStorage,
  objToQueryParams,
  toastrUtil,
} from "../../services/Common.services";
import AddEditTaskModal from "./AddEditTaskModal";
import { initialTaskInfo } from "./constant";
import { setLogin } from "../../state";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state?.user?._id);

  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [taskInfo, setTaskInfo] = useState(initialTaskInfo);
  const [allTasks, setAllTasks] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewTask, setViewTask] = useState(null);

  const searchRef = useRef(null);
  const handleSearch = useCallback(
    debounce((e) => {
      const searchTerm = e.target.value;
      setSearchTerm(searchTerm);
    }, 500),
    []
  );

  useEffect(() => {
    getTasks();
  }, [searchTerm]);

  const getTasks = async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}${loggedInUserId}/get-tasks`;
      console.log(searchTerm);
      url = searchTerm ? url + "?" + objToQueryParams({ searchTerm }) : url;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllTasks(response.data);
    } catch (error) {
      toastrUtil.show(error?.response?.data?.msg, "error");
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddEditTask = (id = "") => {
    if (!taskInfo?.title?.trim())
      return toastrUtil.show("Title is required", "error");
    if (!taskInfo?.description?.trim())
      return toastrUtil.show("Description is required", "error");

    const params = {
      title: taskInfo.title.trim(),
      description: taskInfo.description.trim(),
    };
    const url = `${process.env.REACT_APP_API_URL}${loggedInUserId}/${
      id ? "update" : "create"
    }-task`;
    const query = {
      method: id ? "patch" : "post",
      url,
      data: params,
      headers: {
        Authorization: `Bearer ${token}`, // Add your token here
      },
    };
    setIsLoading(true);
    axios(query)
      .then((res) => {
        setTaskInfo(initialTaskInfo);
        setIsLoading(false);
        toastrUtil.show(
          `Task ${id ? "edited" : "created"} successfully`,
          "success"
        );
        getTasks();
        setAddTask(false);
        if (id) setEditData(null);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        toastrUtil.show(error?.response?.data?.msg, "error");
      });
  };

  const deleteTask = async (taskId) => {
    try {
      if (!taskId) return;
      const url = `${process.env.REACT_APP_API_URL}delete-task/${taskId}`;
      setIsLoading(true);
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: loggedInUserId, // Add custom data in the payload
        },
      });
      setIsLoading(false);
      getTasks();
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting task:", error);
      toastrUtil.show(
        error?.response?.data?.msg || "Error deleting task",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout API
      await axios.post(`${process.env.REACT_APP_API_URL}auth/logout`, null, {
        headers: { Authorization: `Bearer ${getStorage("token")}` },
      });

      // Clear storage and state
      dispatch(
        setLogin({
          user: null,
          token: null,
        })
      );
      localStorage.removeItem("token");

      // Redirect to login/signup page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
    }
  };

  const renderTasks = (status) => {
    return allTasks
      .filter((task) => task.status === status)
      .map((task) => (
        <div className="card mb-3" key={task.id}>
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <p className="card-text">{task.description}</p>
            <p className="card-text">
              <small className="text-muted">Created at: {task.createdAt}</small>
            </p>
            <div className="d-flex gap-2">
              <button
                disabled={isLoading}
                className="btn btn-danger btn-sm"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setEditData(task)}
              >
                Edit
              </button>
              <button
                onClick={() => setViewTask(task)}
                className="btn btn-secondary btn-sm"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <>
      <div className="container mt-4">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <span className="navbar-brand">Task Manager</span>
            <div className="">
              <button
                className="btn btn-success mr-2"
                onClick={() => setAddTask(true)}
              >
                Add Task
              </button>
              <button onClick={handleLogout} className="btn btn-danger ml-5">
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Task Management</h1>
        <button className="btn btn-success">Add Task</button>
      </div> */}
        <div className="input-group mb-3">
          <input
            onChange={handleSearch}
            type="text"
            className="form-control"
            placeholder="Search..."
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-center">TODO</h3>
            {renderTasks("TODO")}
          </div>
          <div className="col-md-4">
            <h3 className="text-center">IN PROGRESS</h3>
            {renderTasks("IN PROGRESS")}
          </div>
          <div className="col-md-4">
            <h3 className="text-center">DONE</h3>
            {renderTasks("DONE")}
          </div>
        </div>
      </div>
      {Boolean(addTask || editData || viewTask) && (
        <>
          <AddEditTaskModal
            viewTask={viewTask}
            editData={editData}
            taskInfo={taskInfo}
            setTaskInfo={setTaskInfo}
            isLoading={isLoading}
            closeModal={() => {
              setAddTask(false);
              setViewTask(false);
              setTaskInfo(initialTaskInfo);
              setEditData(null);
            }}
            onConfirm={handleAddEditTask}
          />
        </>
      )}
    </>
  );
};

export default Home;
