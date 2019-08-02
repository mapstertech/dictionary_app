import * as React from "react";

/** Context */
import { authContext } from "../contexts/AuthContext";
/** Presentation */
import { Wrapper } from "../components/Styles";

import Login from "./Login";
import Definitions from "./Definitions";

function RootContainer() {
  const { auth } = React.useContext(authContext);
  return (
    <Wrapper>
      {auth.token ? <Definitions /> : null}
      {!auth.token && <Login />}
    </Wrapper>
  );
}

export default RootContainer;
