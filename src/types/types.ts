export type User = {
    id: string
    name: string
}

type Answer = {
    id: string
    question_variant_id: string
}

export type Reply = {
    id: string
    test_id: Test["id"]
    user_id: User["id"]
    mark: number
    answers: Answer[]
    is_completed: boolean,
    created_at: string,
    updates_at: string,
}

export enum QuestionType {
    SINGLE = 0,
    MULTIPLE = 1,
}

type QuestionVariant = {
    id: string
    text: string
    is_correct: boolean
}

export type Question = {
    id: string
    point: number
    type: QuestionType
    variants: QuestionVariant[]
    text: string
}

export type Test = {
    id: string
    title: string
    questions: Question[]
}


