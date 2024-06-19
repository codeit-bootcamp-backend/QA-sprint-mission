import React from "react";
import styles from "./Button.module.css";

const Button = ({ color, children, disabled }) => (
  <button className={`${styles.btn} ${styles[color]}`} disabled={disabled}>
    {children}
  </button>
);
export default Button;
