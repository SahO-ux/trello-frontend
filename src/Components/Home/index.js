import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import moment from "moment";
import { debounce } from "lodash";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  displayName,
  getStorage,
  objToQueryParams,
  smallSelectStyle,
  toastrUtil,
} from "../../services/Common.services";
import AddEditTaskModal from "./AddEditTaskModal";
import { initialTaskInfo, taskSortingLabels } from "./constant";
import { setLogin } from "../../state";
import Avatar from "../Common/Avatar";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const userInfo = useSelector((state) => state?.user);

  const [isLoading, setIsLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [taskInfo, setTaskInfo] = useState(initialTaskInfo);
  const [allTasks, setAllTasks] = useState([]);
  const [addTask, setAddTask] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewTask, setViewTask] = useState(null);

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
      let url = `${process.env.REACT_APP_API_URL}${userInfo?._id}/get-tasks`;
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

  const handleAddEditTask = async (id = "") => {
    if (!taskInfo?.title?.trim())
      return toastrUtil.show("Title is required", "error");
    if (!taskInfo?.description?.trim())
      return toastrUtil.show("Description is required", "error");

    const params = {
      ...(id ? { taskId: id } : {}),
      title: taskInfo.title.trim(),
      description: taskInfo.description.trim(),
      status: taskInfo?.status,
    };
    const url = `${process.env.REACT_APP_API_URL}${userInfo?._id}/${
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
    await axios(query)
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
          userId: userInfo?._id,
        },
      });
      toastrUtil.show("Task deleted successfully", "success");
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
      toastrUtil.show("You have been logged out successfully", "success");

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
              <small className="text-muted">
                Created at:{" "}
                {moment(viewTask?.createdAt).format("DD/MM/YYYY, HH:mm:ss")}
              </small>
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
            <div className="d-flex align-items-center">
              {/* Avatar and Username */}
              <div className="d-flex align-items-center text-white me-3">
                <Avatar
                  className="border border-white"
                  size={30} // Adjusted for prominence
                >
                  {displayName(userInfo && userInfo.firstName)}
                </Avatar>
                <div className="ms-2">
                  <span className="fw-bold">{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                </div>
              </div>

              {/* Add Task and Logout Buttons */}
              <button
                className="btn btn-success me-2"
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

        <div className="input-group mb-3">
          <input
            onChange={handleSearch}
            type="text"
            className="form-control"
            placeholder="Search..."
          />
          <span className="me-2">Sort By:</span>
          <Select
            placeholder="Sort Tasks"
            styles={smallSelectStyle}
            options={taskSortingLabels}
            defaultValue={taskSortingLabels[0]}
            onChange={(opt) => {
              let sortedTasks = [];
              if (opt?.value === "newest")
                sortedTasks = [...allTasks].sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
              else
                sortedTasks = [...allTasks].sort(
                  (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                );
              setAllTasks(sortedTasks);
            }}
          />
        </div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-center">TODO</h3>
            {renderTasks("To do")}
          </div>
          <div className="col-md-4">
            <h3 className="text-center">IN PROGRESS</h3>
            {renderTasks("In progress")}
          </div>
          <div className="col-md-4">
            <h3 className="text-center">DONE</h3>
            {renderTasks("Done")}
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
