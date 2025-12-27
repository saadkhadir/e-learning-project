import React from 'react';
import './UserProfile.css';

function UserProfile({ userInfo, roles }) {
    return (
        <div className="user-profile">
            <h2>👤 Profil Utilisateur</h2>
            <div className="profile-info">
                <p><strong>Nom:</strong> {userInfo?.firstName} {userInfo?.lastName}</p>
                <p><strong>Email:</strong> {userInfo?.email}</p>
                <p><strong>Username:</strong> {userInfo?.username}</p>
            </div>

            <h3>Rôles:</h3>
            <div>
                {Array.isArray(roles) && roles.map((role, index) => (
                    <span key={index} className="role-badge">{role}</span>
                ))}
            </div>
        </div>
    );
}

export default UserProfile;