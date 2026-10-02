import apiClient from "../api/client";

export const createWorkoutSession = async (programId, workoutId) => {
  const response = await apiClient.post(`/programs/${programId}/workouts/${workoutId}/sessions`);
  return response.data.data;
};

export const finishWorkoutSession = async (sessionId) => {
  const response = await apiClient.patch(`/workout-sessions/${sessionId}/finish`);
  return response.data.data;
};