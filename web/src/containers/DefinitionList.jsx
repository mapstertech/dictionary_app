import * as React from "react";
/** Context */
import { definitionContext } from "../contexts/DefinitionsContext";
/** Styles */
import { WordItem } from "../components/Styles";
/** Utils */

const DefinitionList = () => {
    const { state, updateDefinition } = React.useContext(definitionContext);
    return (
        <React.Fragment>
            {state.definitions.map(({ id, word, definition, complete }, i) => {
                return (
                    <WordItem
                        key={id}
                        onClick={() =>
                            updateDefinition({
                                type: "UPDATE",
                                payload: { id }
                            })
                        }
                        complete={complete}
                    >
                        {i + 1}. {word}
                        <br />
                        {definition}
                        <br />
                    </WordItem>
                );
            })}
        </React.Fragment>
    );
};
export default DefinitionList;
