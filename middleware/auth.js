const jwt = require('jsonwebtoken')
const config = require('config')
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-token')
    //check if no token
    if (!token) {
        return res.status(401).json({
            msg: "No token, authorization denied"
        })
    }
    //verify the token if found
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user;// decoded here decodes the user from the generated token which we use in routes/auth as req.user.id
        next()
    } catch (err) {
        res.status(401).json({
            msg: 'Token not found'
        })

    }
}