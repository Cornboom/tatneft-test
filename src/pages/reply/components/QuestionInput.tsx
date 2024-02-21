import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, FormControlLabel, FormGroup, FormLabel, Radio, RadioGroup } from '@mui/material';

import api from '../../../api/api.ts';
import { Question, QuestionType, Reply } from '../../../types/types.ts';

import { RootState } from '../../../store/store.ts';
import { setReply } from '../../../store/reducers/testReducer.ts';

import { Form } from './styled.ts'

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
};

export default QuestionInput;
