import apiClient from "../api/client";

export const getProgramById = async (id) => {
  const response = await apiClient.get(`/programs/${id}`);
  return response.data.data;
};