const validateRequest = (schema) => async (req, res, next) => {
    try {
        const updates = await schema.validate(req.body, { abortEarly: false, stripUnknown : true })

        req.updates = updates
        next()
    } catch (error) {
        const { errors } = error

        return res.status(400).json({
            success: false,
            errors
        })
    }
}

export default validateRequest