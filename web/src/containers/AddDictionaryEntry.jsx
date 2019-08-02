import * as React from "react";
import { Button, Form } from "reactstrap";
/** Presentation */
import ErrorMessage from "../components/ErrorMessage";
/* Context */
import { definitionContext } from "../contexts/DefinitionsContext";
import { Input } from "../components/Styles";
/** Custom Hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";
const AddDefinition= () => {
    const { updateDefinition } = React.useContext(definitionContext)
    const { error, showError } = useErrorHandler(null);
    const wordInput = React.useRef(null);
    const defInput = React.useRef(null);
    const addDictionaryItem = () => {
        if (wordInput.current && defInput.current && wordInput.current.value && defInput.current.value) {
            const newWord = wordInput.current.value;
            const newDef = defInput.current.value; 
            updateDefinition({ type: "ADD", payload: { definition: newDef, word: newWord }})
            console.log('Added this word: ', newWord);
            console.log('And it\'s definition is: ', newDef);
            wordInput.current.value = "";
            defInput.current.value = "";
        } else {
            showError("Please fill all fields before clicking add.");
        }
    };
    return (
        <Form
            onSubmit={e => {
                e.preventDefault();
                addDictionaryItem();
            }}
        >
        <Input type="text" ref={wordInput} placeholder="word" />
        <Input type="text" ref={defInput} placeholder="definition" />
        <Button type="submit" block={true}>
            Add
        </Button>
        <br />
            {error && <ErrorMessage errorMessage={error} />}
        </Form>
    );
};
export default AddDefinition;
