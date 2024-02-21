import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"

import QuestionInput from './components/QuestionInput.tsx';

import api from "../../api/api.ts";
import { RootState } from "../../store/store.ts";
import { setTest, setReply } from '../../store/reducers/testReducer.ts';

import { QuestionType } from "../../types/types.ts";

import { PageSubheader } from '../../styles/textStyles.ts';
import { Test } from './styled.ts';

const ReplyPage = () => {
    const { replyId } = useParams();

    const testData = useSelector((state: RootState) => state.test.test);
    const replyData = useSelector((state: RootState) => state.test.reply);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!replyData && replyId) {
            api.getReply(replyId).then((resp) => {
                dispatch(setReply(resp.data));
            });
        }
    }, [replyData, replyId]);

    useEffect(() => {
        if (!testData && replyData) {
            api.getTest(replyData.test_id).then((resp) => {
                dispatch(setTest(resp.data));
            });
        }
    }, [testData, replyData]);

    const isReplyCompleted = useMemo(() => {
        const notFilledQuestions = (testData?.questions || []).filter((question) => {
            const variantIds = question.variants.map((variant) => variant.id);
            const answerIds = (replyData?.answers || []).map((ans) => ans.question_variant_id);
            return variantIds.filter((varId) => answerIds?.includes(varId)).length === 0
        })

        return (notFilledQuestions || []).length === 0;
    }, [testData, replyData]);

    const mark = useMemo(() => {
        if (!isReplyCompleted) {
            return null;
        }

        const marks = (testData?.questions || []).map((question) => {
            let isAnswerCorrect = false;
            const answers = replyData?.answers || [];
            const answerIds = answers.map((ans) => ans.question_variant_id);
            if (question.type === QuestionType.SINGLE) {
                const correctAnswer = question.variants.find((variant) => variant.is_correct)?.id || "";
                isAnswerCorrect = answerIds.includes(correctAnswer)
            } else {
                const correctAnswers = (question.variants.filter((variant) => variant.is_correct) || []).map((variant) => variant.id);
                const incorrectAnswers = (question.variants.filter((variant) => !variant.is_correct) || []).map((variant) => variant.id);
                isAnswerCorrect = correctAnswers.filter((ans) => !answerIds.includes(ans)).length === 0 && incorrectAnswers.filter((ans) => answerIds.includes(ans)).length === 0;
            }
            return isAnswerCorrect ? question.point : 0
        });

        return marks.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0);

    }, [testData, replyData, isReplyCompleted]);

    useEffect(() => {
        if (replyData && replyData.mark === null && mark !== null) {
            api.patchReply({...replyData, mark}).then((resp) => {
                dispatch(setReply(resp.data));
            });
        }
    }, [replyData?.mark, mark]);

    if (!testData) {
        return (
            <>
                Загрузка...
            </>
        )
    }

    return (
        <Test>
            <PageSubheader>
                {testData.title}
            </PageSubheader>
            {testData.questions.map((question) => (
                <QuestionInput key={question.id} question={question} is_completed={isReplyCompleted} mark={mark}/>
            ))}
            {isReplyCompleted && (
                <>
                    Ваши баллы: {mark}
                    <Link to={`/test/${testData.id}`}>
                        Пройти еще раз
                    </Link>
                </>
            )}
        </Test>
    )
}

export default ReplyPage;
