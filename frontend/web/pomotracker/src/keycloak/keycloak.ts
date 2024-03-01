import Keycloak, { KeycloakOnLoad } from "keycloak-js";
function initKeycloak() {
  const initOptions = {
    url: import.meta.env.VITE_KC_BASE_URL,
    realm: import.meta.env.VITE_KC_REALM,
    clientId: import.meta.env.VITE_KC_CLIENT_ID,
    onLoad: "login-required" as KeycloakOnLoad, // check-sso | login-required
    KeycloakResponseType: "code",
    // silentCheckSsoRedirectUri: (window.location.origin + "/silent-check-sso.html")
  };

  return new Keycloak(initOptions);
}

export default initKeycloak;
