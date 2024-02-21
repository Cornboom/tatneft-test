import { Link, Outlet } from "react-router-dom";
import { Container } from './styled.ts';
import React from 'react';
import { Header } from '../../globalStyles/header.ts';

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
