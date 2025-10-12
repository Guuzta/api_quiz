const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin necessário: você não tem permissão para acessar essa rota!'
        })
    }

    next()
}

export default requireAdmin