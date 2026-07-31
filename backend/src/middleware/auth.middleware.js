const jwt = require("jsonwebtoken")

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization
    if(!authHeader){
        return res.status(404).json({
            message:"Authorization header missing"
        })
    }

    const token = authHeader.split(" ")[1]

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRETS)
        req.user = decoded
        next()

    }catch(err){
        return res.status(401).json({
            message:"Ivalid or expired token"
        })
    }

}

module.exports = authMiddleware