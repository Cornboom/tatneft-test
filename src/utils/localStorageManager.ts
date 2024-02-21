import { User, Test, Reply } from "../types/types";

const USER_KEY = "TEST_CREATOR_USER";
const REPLIES_KEY = "TEST_CREATOR_REPLIES";

// функции для работы с localStorage

export const getUser = (): User | null => {
    const rawUser = localStorage.getItem(USER_KEY);

    if (rawUser) {
        return JSON.parse(rawUser);
    }

    return null;
}

export const setUser = (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export const getReplies = (): Record<Test["id"], Reply> => {
    const rawReplies = localStorage.getItem(REPLIES_KEY);

    if (rawReplies) {
        return JSON.parse(rawReplies);
    }

    return {};
}

export const setReplies = (replies: Reply[]) => {
    const replyDict = {}
    for (const reply of replies) {
        replyDict[reply.id] = {...reply}
    }

    localStorage.setItem(REPLIES_KEY, JSON.stringify(replyDict));
}

export const updateReply = (reply: Reply) => {
    const currReplies = getReplies();

    currReplies[reply.id] = {...reply};

    localStorage.setItem(REPLIES_KEY, JSON.stringify(currReplies));
}
