import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: ${props => props.theme.colors.white};
  }

  html, body, #root {
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
  }

  *, button, input, select {
    border: 0;
    outline: 0;
    font-family: 'Roboto', sans-serif;
    color: ${props => props.theme.colors.white};
  }

  button {
    cursor: pointer;
  }
`;