import React, { useState } from "react";
import todo from "../todo-api/todo-api";
import { useHistory } from "react-router-dom";

import "./RegisterForm.css";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const register = async (event) => {
    event.preventDefault();

    try {
      await todo.post("/accounts/register/", {
        username: username,
        email: email,
        password: password,
      });

      history.push("/login");
    } catch (error) {
      setError(error.response);
    }
  };

  return (
    <div className="ui container" id="register">
      <form className="ui form" onSubmit={(event) => register(event)}>
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
        {error ? (
          <div>
            <p className="ui red label">{error.data.username}</p>
          </div>
        ) : null}
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
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
          />
        </div>
        {error ? (
          <div>
            <p className="ui red label">{error.data.password}</p>
          </div>
        ) : null}

        <button className="ui button" type="submit">
          Register
        </button>
      </form>

      <div>
        <p>
          Already registered?
          <button
            className="ui button"
            type="submit"
            onClick={() => history.push("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
