import { get, post } from "../composable/use-request"


export const getAlltodoAsync = () => {
    return get('/todo/getAllTask')
}

export const getOnetodoAsync = (params: { id: string }) => {
    return get('/todo/getOneTask', params)
}

export const addtodoAsync = (params: { title: string, content: string }) => {
    return post('/todo/addTask', params)
}

export const deletetodoAsync = (params: { id: string }) => {
    return post('/todo/removeTask', params)
}

export const updatetodoAsync = (params: { id: string, title: string, content: string }) => {
    return post('/todo/updateTask', params)
}

