import * as React from "react";
import { Button, Form, FormGroup, Input } from "reactstrap";

/** Pres */
import ErrorMessage from "../components/ErrorMessage";

/** custom hooks */
import useErrorHandler from "../utils/custom-hooks/ErrorHandler";

/** Context */
import { authContext } from "../contexts/AuthContext";

/** Utils */
import { apiRequest, validateLoginForm } from "../utils/Helpers";

function Login() {
    const { error, showError } = useErrorHandler(null);
    const [userEmail, setUserEmail] = React.useState("");
    const [userPassword, setUserPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const auth = React.useContext(authContext);

    const authHandler = async () => {
        try {
            setLoading(true);
            const userData = await apiRequest(
               "/auth/login",
                "POST",
                { email: userEmail, password: userPassword }
            );
            console.log(userData);
            const { user, token, msg } = userData;
            if(!token) {
                throw({ message: msg });
            }
            auth.setAuthStatus({ user, token })
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.error(err)
            showError(err.message);
        }
    };

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                // Auth handler
                if (validateLoginForm(userEmail, userPassword, showError)) {
                    authHandler();
                }
            }}
        >
            <br />
            <FormGroup>
              <Input
                type="email"
                name="email"
                value={userEmail}
                placeholder="john@mail.com"
                onChange={e => setUserEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Input
                type="password"
                name="password"
                value={userPassword}
                placeholder="Password"
                onChange={e => setUserPassword(e.target.value)}
              />
            </FormGroup>
            <Button type="submit" disabled={loading} block={true}>
              {loading ? "Loading..." : "Sign In"}
            </Button>
            <br />
            {error && <ErrorMessage errorMessage={error} /> }
        </Form>
    )
}

export default Login;
