import { useContext, useEffect, useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import apiClient from "../../api/client";

import styles from "./DashboardPage.module.css"
 

const DashboardPage = () => {
    const navigate = useNavigate(); 
    const { user, loading, logout } = useContext(AuthContext); 
    const [ programs, setPrograms ] = useState([]);

    const handleLogout = async() => {
        try {
            await logout(); 
            navigate("/"); 
        }  catch (err) {
            console.error(err); 
        }
    }; 

    useEffect(() => {
        const getPrograms = async () => {
            try {
                const response = await apiClient.get("/programs/"); 
                const programs = response.data.data; 
                console.log("PROGRAMS: ", programs); 
                setPrograms(programs || []); 
    
            } catch (err) {
                console.error(err); 
            }
        }
        getPrograms(); 

    }, []); 


    const handleGenerateProgram = () => { 
        navigate("/generate")
    }; 

    const handleDeleteProgram = async (programId) => { 
        
        const confirmDelete = window.confirm("Deleiton will eliminate your Program and all program data. Sure to proceed?");
        if (!confirmDelete) return;

        try {
            const response = await apiClient.delete(`/programs/${programId}`); 

            setPrograms(prev => prev.filter(p => p.id !== programId));
        } catch (error) {
            setError(err.response?.data?.error?.message || "Error deleting Program"); 
        }
    }; 

    if (loading) return <p>loading...</p>; 

    return (
        <main className={styles.dashboardPage}>
            <h1>{user?.data.name}'s Programs</h1>
                <div className={styles.cardsContainer}>
                    {programs.map(program => (
                            <article key={program.id}>
                                <Link to ={`/programs/${program.id}`}
                                className={styles.link}>
                                <header>{program.name}</header>
                                <ul>
                                    <li key={`${program.id}-goal`}>
                                        <span className={styles.cardLiHeader}><b>Goal: </b></span>
                                        <span className={styles.cardLiText}>{program.goal}</span>
                                    </li>
                                    <li key={`${program.id}-level`}>
                                        <span className={styles.cardLiHeader}><b>Level: </b></span>
                                        <span className={styles.cardLiText}>{program.level}</span> 
                                    </li>
                                    <li key={`${program.id}-frequency`}>
                                        <span className={styles.cardLiHeader}><b>Frequency: </b></span>
                                        <span className={styles.cardLiText}>{program.frequency}</span>
                                    </li>
                                </ul>
                                </Link>
                                <button onClick={() => handleDeleteProgram(program.id)} className={styles.deleteProgram}>Delete program</button>
                            </article>
                    ))}
                </div>
                <button onClick={handleGenerateProgram} className={styles.generateProgram}>Generate Program</button>

            <button onClick={handleLogout}>Logout</button>
        </main>
    );
};

export default DashboardPage; 