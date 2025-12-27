import React, { useState } from 'react';
import api from '../api/axios';
import './CourseManagement.css';

function CourseManagement() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        instructor: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/courses', formData);
            setMessage({ type: 'success', text: 'Cours ajouté avec succès!' });
            setFormData({ title: '', description: '', instructor: '' });

            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            if (err.response?.status === 403) {
                setMessage({
                    type: 'error',
                    text: 'Accès refusé: Rôle ADMIN requis'
                });
            } else {
                setMessage({
                    type: 'error',
                    text: "Erreur lors de l'ajout du cours"
                });
            }
        }
    };

    return (
        <div className="course-management">
            <h2>Gestion des cours</h2>

            <form onSubmit={handleSubmit} className="course-form">
                <label className="form-group">
                    <div>Titre du cours:</div>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </label>

                <label className="form-group">
                    <div>Description:</div>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </label>

                <label className="form-group">
                    <div>Instructeur:</div>
                    <input
                        type="text"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit" className="submit-btn">Ajouter le cours</button>
            </form>

            {message.text && (
                <div className={`message ${message.type}`}>{message.text}</div>
            )}
        </div>
    );
}

export default CourseManagement;