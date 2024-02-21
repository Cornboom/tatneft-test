import React from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api.ts";
import { getUser } from "../../localStorageManager.ts";

const TestPage = () => {
    const { testId } = useParams();

    const userData = getUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const currentDate = new Date().toLocaleString("RU-ru");
            api.createReply({
                test_id: testId,
                user_id: userData.id,
                is_completed: false,
                created_at: currentDate,
                upadtes_at: currentDate,
            }).then((resp) => {
                navigate(`/reply/${resp.data.id}`)
            })
        }
    }, []);

    return (
        <>
            Загрузка...
        </>
    )
}

export default TestPage;
