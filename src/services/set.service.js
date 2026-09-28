import apiClient from "../api/client";

export const updateSetData = async (sessionId, setId, setData) => {
    const response = await apiClient.patch(`/workout-sessions/${sessionId}/sets/${setId}`).send(setData); 
    return response.data.data;
};