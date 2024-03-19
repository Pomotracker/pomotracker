import "./App.css";
import useKeycloak from "./hooks/useKeycloak";
import { Homepage } from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import "./globals.css";
import { createContext } from "react";
import Keycloak from "keycloak-js";

export const AuthContext = createContext<Keycloak | null>(null);

function App() {
  const { keycloak } = useKeycloak();

  return (
    <AuthContext.Provider value={keycloak}>
      <main className="flex h-screen">
        <Routes>{<Route index element={<Homepage />} />}</Routes>
      </main>
    </AuthContext.Provider>
  );
}

export default App;
