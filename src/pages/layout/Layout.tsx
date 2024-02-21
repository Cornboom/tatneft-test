import React from 'react';
import { Link, Outlet } from "react-router-dom";

import { Header } from '../../styles/header.ts';
import { Container } from './styled.ts';

const Layout = () => {
    return (
        <Container>
            <Header>
              <Link to='/'>QUIZ app</Link>
            </Header>
            <Outlet/>
        </Container>
    )
}

export default Layout;
