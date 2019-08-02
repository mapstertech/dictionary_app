import * as React from "react";
import AuthContextProvider from "./contexts/AuthContext";
import DefinitionContextProvider from "./contexts/DefinitionsContext";
import RootContainer from "./containers/RootContainer"

function App() {
  return (
    <AuthContextProvider>
        <DefinitionContextProvider>
            <RootContainer />
        </DefinitionContextProvider>
    </AuthContextProvider>
  );
}

export default App;

