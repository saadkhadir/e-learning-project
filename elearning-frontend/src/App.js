import React, { useState, useEffect } from 'react';
import keycloak, { initKeycloak } from './Keycloak';
import CourseList from './components/CourseList';
import CourseManagement from './components/CourseManagement';
import UserProfile from './components/UserProfile';
import api from './api/axios';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initKeycloak({ onLoad: 'login-required', checkLoginIframe: false })
      .then((authenticated) => {
        setAuthenticated(authenticated);
        if (authenticated) {
          loadUserInfo();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Keycloak init error', err);
        setLoading(false);
      });
  }, []);

  const loadUserInfo = async () => {
    try {
      // ensure token is available and refreshed
      try {
        await keycloak.updateToken(10);
      } catch (e) {
        // updateToken can fail if no valid session — log for debugging
        console.warn('Keycloak token update failed (may be OK if not logged in yet):', e);
      }

      // build explicit headers to guarantee token is sent for this request
      const headers = keycloak.token ? { Authorization: `Bearer ${keycloak.token}` } : {};

      const response = await api.get('/cours/me', { headers });
      setUserInfo(response.data);

      // prefer roles from backend; fallback to roles available in Keycloak token
      let userRoles = [];
      if (response.data?.roles && Array.isArray(response.data.roles)) {
        userRoles = response.data.roles.map((r) => (r.authority ? r.authority.replace('ROLE_', '') : r));
      } else {
        const realmRoles = keycloak.tokenParsed?.realm_access?.roles || [];
        const resourceRoles = Object.values(keycloak.tokenParsed?.resource_access || {})
          .flatMap((r) => r.roles || []);
        userRoles = Array.from(new Set([...realmRoles, ...resourceRoles])).map((r) => r.replace?.('ROLE_', '') || r);
      }
      setRoles(userRoles);
    } catch (error) {
      console.error('Error loading user info:', error);
    }
  };

  const handleLogout = () => {
    keycloak.logout({ redirectUri: 'http://localhost:3000' });
  };

  const isAdmin = () => roles.includes('ADMIN');
  const isStudent = () => roles.includes('STUDENT');

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!authenticated) {
    return <div>Authentification en cours...</div>;
  }

  return (
      <div className="App">
        <header className="app-header">
          <h1>🎓 Plateforme E-Learning</h1>
          <button onClick={handleLogout} className="btn">Déconnexion</button>
        </header>

        <div className="container">
          <div className="content-grid">
            <aside className="section-card">
              {userInfo && <UserProfile userInfo={userInfo} roles={roles} />}
            </aside>

            <main>
              {(isStudent() || isAdmin()) && (
                  <section className="section-card mb-1">
                    <h2>📚 Cours Disponibles</h2>
                    <CourseList />
                  </section>
              )}

              {isAdmin() && (
                  <section className="section-card">
                    <h2>⚙️ Gestion des Cours (Admin)</h2>
                    <CourseManagement />
                  </section>
              )}

              {!isStudent() && !isAdmin() && (
                  <p className="alert">Aucun rôle assigné. Contactez l'administrateur.</p>
              )}
            </main>
          </div>
        </div>
      </div>
  );
}

export default App;