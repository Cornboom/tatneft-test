import axios, { AxiosPromise, AxiosRequestConfig, Method } from "axios";
import { User, Test, Reply } from "./types";

type FetchApiProps<Body> = {
    url: string,
    method?: Method,
    data?: Body
}

const fetchApi = <Resp, Body = void>(apiProps: FetchApiProps<Body>): AxiosPromise<Resp> => {
    const axiosConfig: AxiosRequestConfig<Body> = {
        baseURL: "http://localhost:8000",
        method: "GET",
        ...apiProps,
    }

    return axios(axiosConfig);
}

type CreateUserBody = {
    name: User["name"]
}

type CreateReplyBody = Partial<Reply>

class API {
    getTests = () => fetchApi<Test[]>({
        url: `/tests`,
    })

    getTest = (testId: Test["id"]) => fetchApi<Test>({
        url: `/tests/${testId}`,
    })

    getUser = (userId: User["id"]) => fetchApi<User>({
        url: `/users/${userId}`,
    })

    createUser = (username: User["name"]) => fetchApi<User, CreateUserBody>({
        url: `/users`,
        method: "POST",
        data: {
            name: username
        },
    })

    getReply = (replyId: Reply["id"]) => fetchApi<Reply>({
        url: `/replies/${replyId}`,
    })

    getReplies = (userId: User["id"]) => fetchApi<Reply[]>({
        url: `/replies/?user_id=${userId}`,
    })

    createReply = (data: CreateReplyBody) => fetchApi<Reply, CreateReplyBody>({
        url: `/replies`,
        method: "POST",
        data
    })

    patchReply = (data: Partial<Reply>) => fetchApi<Reply, CreateReplyBody>({
        url: `/replies/${data.id}`,
        method: "PATCH",
        data
    })
}

const api = new API();

export default api;