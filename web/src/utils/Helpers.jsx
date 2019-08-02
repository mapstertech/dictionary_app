import * as validator from "validator";
import { DEFAULT_USER_AUTH } from "../Constants"
export const apiRequest = async(
    url,
    method,
    bodyParams
) => {
    const header = new Headers({
        Accept: "application/json",
        "Content-Type": "application/json"
    })

    const response = await fetch(url, {
        method: method,
        headers: header,
        body: bodyParams ? JSON.stringify(bodyParams) : undefined
        })

    return await response.json();
}

export const validateLoginForm = (
  email,
  password,
  setError) => {
  // Check for undefined or empty input fields
  if (!email || !password) {
    setError("Please enter a valid email and password.");
    return false;
  }
// Validate email
  if (!validator.isEmail(email)) {
    setError("Please enter a valid email address.");
    return false;
  }
    return true;
}

export const getStoredUserAuth = () => {
    const auth = window.localStorage.getItem("UserAuth");
    if(auth) {
        return JSON.parse(auth);
    }
    return DEFAULT_USER_AUTH;
};
