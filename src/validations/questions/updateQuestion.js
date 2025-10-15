import { object, string, number, array } from 'yup'

const updateQuestionSchema = object({
    text: string()
        .trim()
        .min(1, 'O texto não pode ser vazio!'),
    category: string()
        .trim()
        .min(1, 'A categoria não pode ser vazia!'),
    difficulty: string()
        .transform(value => value?.toLowerCase())
        .oneOf(['fácil', 'médio', 'difícil'], 'Dificuldade inválida!'),
    options: array()
        .of(string().trim().min(1, 'Opção não pode ser vazia!'))
        .min(2, 'A questão precisa ter pelo menos duas opções!'),
    correctAnswer: number()
        .integer('O índice da resposta deve ser um número inteiro!')
        .min(0, 'O índice da resposta correta não pode ser um número negativo!'),
})

export default updateQuestionSchema