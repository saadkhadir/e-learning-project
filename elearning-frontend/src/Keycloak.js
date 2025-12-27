import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'elearning-realm',
    clientId: 'react-client'
});

let initPromise = null;

export function initKeycloak(options = { onLoad: 'login-required', checkLoginIframe: false }) {
    if (!initPromise) {
        initPromise = keycloak.init(options);
    }
    return initPromise;
}

export default keycloak;