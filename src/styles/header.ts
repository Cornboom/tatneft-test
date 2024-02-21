import styled from 'styled-components';

export const Header = styled.header`
  font-size: 2.5rem;
  line-height: 3.75rem;
  width: 100%;
  padding: 1rem;
  background-color: cornsilk;
  
  a {
    &:hover {
      text-decoration: none !important;
    }
    
    &:visited {
      color: initial;
    }
  }
  
  @media screen and (max-width: 768px) {
    text-align: center;
    font-size: 2.25rem;
  }
`;
