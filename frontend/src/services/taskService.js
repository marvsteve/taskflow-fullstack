import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

const getToken = () => {
  return localStorage.getItem("token");
};

const config = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`
  }
});

export const getTasks = async (search = "", page = 1, limit = 5) => {
  const response = await axios.get(
    `${API_URL}?search=${search}&page=${page}&limit=${limit}`,
    config()
  );

  return response.data;
};

export const createTask = async (data) => {
  const response = await axios.post(API_URL, data, config());
  return response.data;
};

export const updateTask = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, config());
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, config());
  return response.data;
};