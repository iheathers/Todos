import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import todo from "../todo-api/todo-api";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);
  const history = useHistory();

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };

  useEffect(() => {
    (async () => {
      const response = await todo.get("/tasks/", {
        headers: authHeader,
      });
      setTasks(response.data);
    })();
  }, []);

  const deleteTask = async (task) => {
    await todo.delete(`/tasks/${task.id}`, {
      headers: authHeader,
    });
    setTasks(tasks.filter((obj) => obj.id !== task.id));
  };

  const prepareUpdateTask = (task) => {
    setInputValue(task.task_name);
    setIsUpdate(true);
    setId(task.id);
  };

  const checkTask = async (event, task) => {
    const response = await todo.put(
      `/tasks/${task.id}/`,
      {
        task_name: task.task_name,
        is_complete: event.target.checked,
      },
      { headers: authHeader }
    );
    setTasks(
      [...tasks.filter((obj) => obj.id !== task.id), response.data].sort(
        (a, b) => a.id - b.id
      )
    );
  };

  const updateSelectedTask = async () => {
    const response = await todo.put(
      `/tasks/${id}/`,
      { task_name: inputValue },
      { headers: authHeader }
    );
    setIsUpdate(false);
    setTasks(
      [...tasks.filter((obj) => obj.id !== id), response.data].sort(
        (a, b) => a.id - b.id
      )
    );
  };

  const createTask = async () => {
    const response = await todo.post(
      "/tasks/",
      { task_name: inputValue },
      { headers: authHeader }
    );
    setTasks([...tasks, response.data]);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <>
      <div
        className="ui container"
        onClick={() => {
          logout();
          history.push("/login");
        }}
      >
        <button className="ui button right floated red">Logout</button>
      </div>

      <div className="ui container" id="appContainer">
        <div className="ui container" id="formContainer">
          <form
            className="ui clearing segment raised fluid input"
            onSubmit={(event) => {
              event.preventDefault();
              if (isUpdate) {
                updateSelectedTask();
              } else {
                createTask(event);
              }
              setInputValue("");
            }}
          >
            <input
              type="text"
              placeholder="Add a Task..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button className="ui right floated button" type="submit">
              Add
            </button>
          </form>
        </div>

        <div className="ui container segment raised " id="tasksSegment">
          {tasks.map((task) => {
            return (
              <div
                key={task.id}
                className="ui grid teal segment"
                id="taskSegment"
              >
                <div className="checkbox twelve wide column" id="icon">
                  <input
                    type="checkbox"
                    id={task.id}
                    name=""
                    defaultChecked={task.is_complete}
                    onClick={(event) => checkTask(event, task)}
                  />
                  <label htmlFor={task.id}>
                    <span>
                      {task.is_complete ? (
                        <s>{task.task_name}</s>
                      ) : (
                        <>{task.task_name}</>
                      )}
                    </span>
                  </label>
                </div>
                <div
                  onClick={() => prepareUpdateTask(task)}
                  className="two wide column"
                  id="editIcon"
                >
                  <i className="big edit icon "></i>
                </div>
                <div
                  onClick={() => deleteTask(task)}
                  className="two wide column"
                  id="deleteIcon"
                >
                  <i className="big trash icon red"></i>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default App;
