import {
    object,
    string
} from 'yup'

const updateQuizSchema = object({
    title: string()
        .trim()
        .min(1, 'O título não pode ser vazio!'),
    descripiton: string()
        .trim()
        .min(1, 'A descrição não pode ser vazia!'),
    category: string()
        .trim()
        .min(1, 'A categoria não pode ser vazia!'),
    difficulty: string()
        .transform(value => value?.toLowerCase())
        .oneOf(['fácil', 'médio', 'difícil'], 'Dificuldade inválida!')
})

export default updateQuizSchema