import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    overflow-x: hidden;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    font-family: ${({ theme }) => theme.font};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    letter-spacing: -0.011em;
  }

  #root {
    height: 100%;
  }

  h1, h2, h3 {
    letter-spacing: -0.02em;
    font-weight: 600;
  }

  button {
    font-family: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`;
