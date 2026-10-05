import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage/LoginPage"; 
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from "./pages/DashboardPage/DashboardPage"; 
import GenerateProgramPage from './pages/GenerateProgramPage/GenerateProgramPage';
import ProgramDetailPage from './pages/ProgramDetailPage/ProgramDetailPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage/WorkoutDetailPage'; 
import ProtectedRouteOutlet from './layouts/ProtectedRoutesLayout/ProtectedRoutesLayout';
import MainLayout from './layouts/MainLayout/MainLayout';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route path='/register' element={ <RegisterPage /> } />
        <Route path='/' element={ <LoginPage /> } />

        <Route element= { <ProtectedRouteOutlet /> }>
          <Route element= { <MainLayout /> }>
            <Route path='/dashboard' element={ <DashboardPage /> } />

            <Route path="/generate" element={ <GenerateProgramPage /> } />

            <Route path='/programs/:id' element= { <ProgramDetailPage /> } />

            <Route path='/programs/:programId/workout/:workoutId' element= { <WorkoutDetailPage /> } />
          </Route>
        </Route>
        <Route path="*" element={ <NotFoundPage /> } />
      </ Routes>
    </BrowserRouter>
  ); 
}; 

export default App; 
