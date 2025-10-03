import { post } from "../composable/use-request"


export const imagePostAsync = (params: any) => {
    return post('/upload/image', params)
}


