import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import { RootState } from "../../store.ts";
import api from "../../api.ts";
import { setTest, setReply } from '../../reducers/testReducer.ts';
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from "@mui/material";
import { QuestionType, Question, Reply } from "../../types.ts";
import { Form, Test } from './styled.ts';
import { PageSubheader } from '../../globalStyles/textStyles.ts';

type QuestionProps = {
    question: Question
    is_completed: Reply["is_completed"]
    mark: null | Reply["mark"]
}

const QuestionInput = ({ question, is_completed, mark }: QuestionProps) => {
    const replyData = useSelector((state: RootState) => state.test.reply);
    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const data = new FormData(e.target);
        const values = [...data.keys()];

        const newReply = {
            ...replyData,
            answers: [
                ...replyData?.answers || [],
                ...values.map((value) => ({
                    id: `121`,
                    question_variant_id: value,
                })),
            ],
            updated_at: new Date().toLocaleString("RU-ru"),
            is_completed,
        };

        if (mark) {
            newReply.mark = mark;
        }

        api.patchReply(newReply).then((resp) => {
            dispatch(setReply(resp.data));
        });
    }

    const variantIds = question.variants.map((variant) => variant.id);
    const answers = (replyData?.answers|| []).filter((answer) => variantIds.includes(answer.question_variant_id)) || []
    const isAnswered = answers.length > 0;

    const shuffle = (arr: any[]) => { 
        return arr.sort(() => Math.random() - 0.5); 
    }; 

    const variants = [...question.variants]
    const shuffledVariants = shuffle(variants)

    return (
        <Form key={question.id} onSubmit={handleSubmit}>
            <FormLabel>
                {question.text}
            </FormLabel>
            <FormGroup>
                <RadioGroup value={(answers[0] || {}).question_variant_id}>
                    {shuffledVariants.map((variant) => {
                        const answers = (replyData?.answers || []).filter((answer) => answer.question_variant_id === variant.id) || []
                        const isChecked = answers.length > 0;
                        let correctProps = isAnswered && variant.is_correct && {
                            "style": {
                                "color": "green",
                            }
                        }

                        const extraProps = {}

                        if (isAnswered && question.type === QuestionType.MULTIPLE) {
                            extraProps.checked = isChecked;
                        }
                        if (question.type === QuestionType.MULTIPLE) {
                            return (
                                <FormControlLabel
                                    disabled={isAnswered}
                                    name={variant.id} 
                                    key={variant.id} 
                                    label={variant.text} 
                                    control={<Checkbox/>}
                                    {...correctProps}
                                    {...extraProps}
                                />
                            )
                        } else {
                            return (
                                <FormControlLabel
                                    value={variant.id}
                                    disabled={isAnswered}
                                    name={variant.id} 
                                    key={variant.id} 
                                    label={variant.text} 
                                    control={<Radio/>}
                                    {...correctProps}
                                />
                            )
                        }
                    })}
                </RadioGroup>
            </FormGroup>
            {!isAnswered && (
                <Button type="submit" variant="outlined">
                    Ответить
                </Button>
            )}
        </Form>
    );
}

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
                <div>
                    Ваши баллы: {mark}
                </div>
            )}
        </Test>
    )
}

export default ReplyPage;
