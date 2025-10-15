import { object, string, number, array } from 'yup'

const createQuestionSchema = object({
    quizId: string()
        .required('O campo quizId é obrigatório!'),
    text: string()
        .required('Campo texto é obrigatório!'),
    category: string()
        .required('Campo categoria é obrigatório!'),
    difficulty: string()
        .transform(value => value.toLowerCase())
        .oneOf(['fácil', 'médio', 'difícil'], 'Dificuldade inválida!')
        .required('Campo dificuldade é obrigatório!'),
    options: array()
        .of(string().required())
        .min(2, 'A questão precisa ter pelo menos duas opções!')
        .required('Campo opções é obrigatório!'),
    correctAnswer: number()
        .integer('O índice da resposta deve ser um número inteiro!')
        .min(0, 'O índice da resposta correta não pode um número negativo!'),
    createdBy: string()
        .required('O campo createdBy é obrigatório!')
})

export default createQuestionSchema