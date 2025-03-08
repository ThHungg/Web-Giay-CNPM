import { message } from "antd";
const success = (mes = "Success") => {
  message.success("This is a success message");
};

const error = (mes = "Error") => {
  message.error("This is an error message");
};

const warning = (mes = "Warning") => {
  message.warning("This is a warning message");
};

export { success, error, warning };
