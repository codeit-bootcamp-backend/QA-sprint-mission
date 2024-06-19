import { useState } from "react";
import { ERROR_MESSAGES } from "../utils/error_constants";

const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (value.length < 1 || value.length > 10) {
          error = `${ERROR_MESSAGES.name}`;
        }
        break;
      case "description":
        if (value.length < 10 || value.length > 100) {
          error = `${ERROR_MESSAGES.description}`;
        }
        break;
      case "price":
        if (isNaN(value) || value.length < 1) {
          error = `${ERROR_MESSAGES.price}`;
        }
        break;
      case "tags":
        if (value.length > 5) {
          error = `${ERROR_MESSAGES.tags}`;
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  return { errors, validate };
};

export default useValidation;
