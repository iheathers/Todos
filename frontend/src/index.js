import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

import App from "./components/App";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/">
      <App />
    </Route>
    <Route exact path="/register">
      <RegisterForm />
    </Route>
    <Route exact path="/login">
      <LoginForm />
    </Route>
  </BrowserRouter>,
  document.getElementById("root")
);
