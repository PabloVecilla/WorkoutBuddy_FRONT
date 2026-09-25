import apiClient from "../api/client";

export const createWorkoutSession = async (programId, workoutId) => {
  const response = await apiClient.post(`/programs/${programId}/workouts/${workoutId}/sessions`);
  return response.data.data;
};