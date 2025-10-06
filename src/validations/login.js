import { object, string } from 'yup'

const loginUserSchema = object({
    email: string()
        .required('Campo email é obrigatório!')
        .email('Formato de email inválido!'),
    password: string()
        .required('Campo senha é obrigatório!')
        .min(6, 'A senha precisa ter pelo menos 6 caracteres!')
})

export default loginUserSchema