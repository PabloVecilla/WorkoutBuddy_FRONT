import apiClient from "../api/client";

export const getAlternativesForExercise = async (movementPattern) => {
    const response = await apiClient.get(`/exercises/movement-pattern/${movementPattern}`); 
    return response.data.data;
}; 