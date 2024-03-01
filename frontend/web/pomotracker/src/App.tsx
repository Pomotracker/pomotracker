import "./App.css";
import useKeycloak from "./hooks/useKeycloak";
import { Homepage } from "./pages/HomePage";

function App() {
  const { keycloak, authenticated } = useKeycloak();
  return (
    authenticated && (
      <div>
        <div>{keycloak?.refreshToken}</div>
        <Homepage />
      </div>
    )
  );
}

export default App;
