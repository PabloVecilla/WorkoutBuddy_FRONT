import { useState, useEffect } from 'react'; 
import apiClient from "./api/client";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from "./pages/LoginPage"; 
import DashboardPage from "./pages/DashboardPage/DashboardPage"; 
import ProtectedRoute from './routes/ProtectedRoute';
import GenerateProgramPage from './pages/GenerateProgramPage/GenerateProgramPage';
import ProgramDetailPage from './pages/ProgramDetailPage/ProgramDetailPage';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/register' element={ <RegisterPage /> } />
        <Route path='/' element={ <LoginPage /> } />

        <Route path='/dashboard' element={ 
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        <Route path="/generate" element={ 
          <ProtectedRoute>
            <GenerateProgramPage />
          </ProtectedRoute>
         } />

         <Route path='/programs/:id' element= {
          <ProtectedRoute>
            <ProgramDetailPage />
          </ProtectedRoute>
         } />
      </ Routes>
    </BrowserRouter>
  ); 
}; 

export default App
