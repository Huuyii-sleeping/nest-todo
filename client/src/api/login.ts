import { post } from "../composable/use-request"

export const userLoginAsync = (params: { username: string, password: string }) => {
    return post('/user/login', params)
}