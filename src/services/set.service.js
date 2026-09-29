import apiClient from "../api/client";

export const updateSetData = async (sessionId, setId, setData) => {
  const response = await apiClient.patch(
    `/workout-sessions/${sessionId}/sets/${setId}`,
    setData
  );

  return response.data.data;
};