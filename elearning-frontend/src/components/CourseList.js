import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './CourseList.css';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cours');
            setCourses(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des cours');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Chargement des cours...</div>;
    if (error) return (
        <div className="error">
            {error}
            <div style={{marginTop: '0.5rem'}}>
                <button className="btn" onClick={loadCourses}>Réessayer</button>
            </div>
        </div>
    );

    return (
        <div className="course-list">
            {courses.length === 0 ? (
                <p>Aucun cours disponible</p>
            ) : (
                <ul className="courses-grid">
                    {courses.map((course) => (
                        <li key={course.id || course.title} className="course-card">
                            <h4>{course.title}</h4>
                            <p>{course.description}</p>
                            <p className="instructor">👨‍🏫 {course.instructor}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CourseList;
