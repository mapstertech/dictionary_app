import * as React from "react";
/** Styles */
/** Components */
import AddDefinition from "./AddDictionaryEntry";
import DefinitionList from "./DefinitionList";
/** Presentation/UI */
import { DefinitionContainer } from "../components/Styles";
function Definitions() {
  return (
    <DefinitionContainer>
      <h2>Add new word to definitions</h2>
      <AddDefinition/>
      <DefinitionList/>
    </DefinitionContainer>
  );
}
export default Definitions;
