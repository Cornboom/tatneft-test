import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, InputLabel, Input, Button } from "@mui/material";

import api from '../../api/api.ts';
import { RootState } from "../../store/store";
import { setReplies, setUser, setTests } from '../../store/reducers/userReducer.ts'

import { PageSubheader, Text } from '../../styles/textStyles.ts';
import { Form, TestsWrapper } from './styled.ts';


const HomePage = () => {
    const userData = useSelector((state: RootState) => state.user.user);
    const replies = useSelector((state: RootState) => state.user.replies);
    const tests = useSelector((state: RootState) => state.user.tests);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userData) {
            api.getReplies(userData.id).then((resp) => {
                dispatch(setReplies(resp.data))
            })
        }
    }, [userData]);

    useEffect(() => {
        if (userData) {
            api.getTests().then((resp) => {
                dispatch(setTests(resp.data))
            })
        }
    }, [userData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const values = [...data.values()];

        const username = values[0].toString();
        
        api.createUser(username).then((resp) => {
            dispatch(setUser(resp.data));
        })
    }

    return (
        <>
            {userData ? (
                <PageSubheader>Домашняя страница</PageSubheader>
            ) : (
                <PageSubheader>Добро пожаловать</PageSubheader>
            )}

            {!userData && (
                <>
                    <Form onSubmit={handleSubmit}>
                        <FormControl fullWidth required>
                            <InputLabel htmlFor="name-input">Ваше имя</InputLabel>
                            <Input name="a" id="name-input"/>
                        </FormControl>
                        <Button type="submit" variant="contained" size="large">
                            Сохранить
                        </Button>
                    </Form>
                </>
            )}

            {replies.length > 0 && (
                <TestsWrapper>
                    <Text>
                        Реплаи
                    </Text>
                    {replies.map((reply) => (
                        <div key={reply.id}>
                            <Link to={`/test/${reply.id}`}>
                                {reply.test_id}
                            </Link>
                        </div>
                    ))}
                </TestsWrapper>
            )}
            {tests.length > 0 && (
                <TestsWrapper>
                    <Text>
                        Доступные тесты
                    </Text>
                    {tests.map((test) => (
                        <div key={test.id}>
                            <Link to={`/test/${test.id}`}>
                                {test.title}
                            </Link>
                        </div>
                    ))}
                </TestsWrapper>
            )}
        </>
    );
}

export default HomePage;
