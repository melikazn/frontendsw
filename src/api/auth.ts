import api from "./axios";

// Registrerar en ny användare
export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/users/register", data);
};

// Loggar in en användare
export const loginUser = (data: {
  email: string;
  password: string;
}) => {
  return api.post("/users/login", data);
};
