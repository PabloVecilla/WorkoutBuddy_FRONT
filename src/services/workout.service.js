import apiClient from "../api/client";

export const getWorkoutExercisesInProgramById = async (programId, workoutId) => {
  const response = await apiClient.get(`/programs/${programId}/workouts/${workoutId}/workout-exercises`); 
  return response.data.data;
};

export const updateWorkoutExercise = async (programId, workoutId, workoutExerciseId, updates) => {
    const response = await apiClient.patch(
      `/programs/${programId}/workouts/${workoutId}/workout-exercises/${workoutExerciseId}`,
      updates
    );
    return response.data.data;
};