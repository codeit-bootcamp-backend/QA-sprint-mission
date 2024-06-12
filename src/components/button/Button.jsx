import React from "react";
import "./Button.css";

const Button = ({ children, color }) => {
  return <button className={`btn ${color}`}>{children}</button>;
};

export default Button;
