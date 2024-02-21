import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;

    &:focus {
      outline: 0;
    }
  }

  html,
  body {
    min-height: 100vh;
  }

  html {
    text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100vh;
    margin: 0;
    padding: 0;
    color: black;
    line-height: 1.5;
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  a,
  button {
    cursor: pointer;
  }

  button {
    font-family: inherit;
  }

  a {
    transition: all 0.25s ease-in-out 0s;
    text-decoration: none;
    outline: none;

    &:focus,
    &:hover {
      text-decoration: underline;
    }
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  textarea {
    font-family: 'Noto Sans', sans-serif;
  }

  input {
    margin: 0;
  }

  p {
    margin: 0;
  }
  
  h1,
  h2,
  h3,
  h4,
  h5 {
    margin: 0;
  }
`;

export default GlobalStyles;

