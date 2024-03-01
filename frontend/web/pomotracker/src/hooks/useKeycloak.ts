import { useEffect, useState } from "react";
import Keycloak, { KeycloakOnLoad } from "keycloak-js";
import initKeycloak from "../keycloak/keycloak";

const useKeycloak = () => {
  const [keycloak, setKeycloak] = useState<null | Keycloak>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setKeycloak(initKeycloak());
  }, []);

  useEffect(() => {
    if (keycloak) {
      keycloak
        .init({
          onLoad: "login-required" as KeycloakOnLoad,
          checkLoginIframe: true,
          pkceMethod: "S256",
        })
        .then(
          (auth) => {
            if (!auth) {
              window.location.reload();
            } else {
              console.info("Authenticated");
              console.log("auth", auth);
              console.log("Keycloak");
              setAuthenticated(true);
            }
          },
          (err: Error) => {
            console.error("Authenticated Failed", err);
          }
        );
    }
  }, [keycloak]);

  return { keycloak, authenticated };
};

export default useKeycloak;
