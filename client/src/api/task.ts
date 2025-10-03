import { get, post } from "../composable/use-request"


export const getAlltodoAsync = () => {
    return get('/todo/getAlltodo')
}

export const getOnetodoAsync = (params: { id: string }) => {
    return get('/todo/getOnetodo', params)
}

export const addtodo = (params: { title: string, content: string }) => {
    return post('/todo/addtodo', params)
}

export const deletetodo = (params: { id: string }) => {
    return post('/todo/deletetodo', params)
}

export const updatetodo = (params: { id: string, title: string, content: string }) => {
    return post('/todo/updatetodo', params)
}

