import * as React from "react";
import styled from "styled-components";

const ErrorMessage = styled.p`
    text-align: center;
    margin-top: 10px;
    color: #ff0000;
    width: 250px;
`;


const ErrorMessageContainer = ({
  errorMessage
}) => {
  return <ErrorMessage>{errorMessage}</ErrorMessage>;
};

export default ErrorMessageContainer;
