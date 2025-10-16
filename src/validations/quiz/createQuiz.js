import {
    object,
    string,
} from 'yup'

const createQuizSchema = object({
    title: string()
        .required('O campo título é obrigatório!'),
    description: string()
        .required('O campo descrição é obrigatório!'),
    category: string ()
        .required('O campo categoria é obrigatório!'),
    difficulty: string()
        .transform(value => value.toLowerCase())
        .oneOf(['fácil', 'médio', 'difícil'], 'Dificuldade inválida!')
        .required('O campo dificuldade é obrigatório!'),
    createdBy: string()
        .required('O campo createdBy é obrigatório!')
})

export default createQuizSchema