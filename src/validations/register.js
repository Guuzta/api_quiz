import { object, string} from 'yup'

const registerUserSchema = object({
    name: string()
        .required('Campo nome é obrigatório')
        .min(4, 'O nome precisa ter pelo menos 4 caracteres!'),
    email: string()
        .required('Campo email é obrigatório')
        .email('Formato de email inválido!'),
    password: string()
        .required('Formato de senha inválido!')
        .min(6, 'A senha precisa ter pelo menos 6 caracteres!')
})

export { registerUserSchema }