import { useState, useEffect } from 'react'; 
import apiClient from "./api/client";

function App() {
  const [ message, setMessage ] = useState("Checking backend..."); 
  useEffect(() => { 
    const checkBackend = async () => {
      try {
        const response = await apiClient.get("/"); 

        setMessage(response.data.message); 

      } catch (err) {
        setMessage(err.response?.data?.message || err.message); 
      }
    }; 
    checkBackend(); 
  }, []); 

  return (
    <main>
      <h1>Workout Buddy</h1>
      <p>{ message }</p>
    </main>
  ); 
}

export default App
