import React, { useState } from "react";
import todo from "../todo-api/todo-api";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await todo.post("/accounts/login/", {
        username: username,
        password: password,
      });
      const token = response.data.token;
      localStorage.setItem("refresh_token", token.refresh);
      localStorage.setItem("access_token", token.access);
      history.push("/");
    } catch (error) {
      setError(error.response);
    }
  };

  return (
    <div className="ui container" id="login">
      <form className="ui form" onSubmit={(event) => login(event)}>
        <div className="field">
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            autoComplete="off"
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            autoComplete="off"
          />
        </div>

        <button className="ui button" type="submit">
          Login
        </button>
      </form>
      <div>
        {error ? <p className="ui red label">{error.data.error}</p> : null}
      </div>
      <div>
        <p>
          Not registered yet?
          <button
            className="ui button"
            onClick={() => history.push("/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
