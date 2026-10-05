import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { getProgramById } from "../../services/program.service";
import styles from "./ProgramDetailPage.module.css";

const ProgramDetailPage = () => {
    const { loading } = useContext(AuthContext); 
    const { id } = useParams(); 

    const [ program, setProgram ] = useState(null); 
    const [ error, setError ] = useState(""); 

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const data = await getProgramById(id); 
                setProgram(data);  
            } catch (err) {
                setError(err.response?.data?.error?.message || "Error loading Program"); 
            }
        }; 

        fetchProgram(); 
    }, [id]);

    if (loading) return <p>loading...</p>; 
    if (error) return <p>{error}</p>;
    if (!program) return <p>Fetching program details...</p>; 

    const formatDBInput = (text) => {
        const withSpaces = text.replaceAll('_', ' '); 
        return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
    };

    return (
        <main className={styles.programDetailPage}>
            <h1>Program: {program.name}</h1>
            <div className={styles.cardsContainer}>
                {program?.Workouts?.map((day) => (
                    /* Key moved to outer Link wrapper */
                    <Link key={day.id} to={`workout/${day.id}`} className={styles.link}>
                        <article className="card">
                            <header>
                                <h2>
                                    Day <b>{day.dayNumber} - {formatDBInput(day.focus)}</b>
                                </h2>
                            </header>
                        </article>
                        <p className={styles.weightSymbol}>||-||</p>
                    </Link>
                ))}
            </div>
        </main>
    );
};

export default ProgramDetailPage;