const createError = require("http-errors")
const jwt  = require("jsonwebtoken")


module.exports={
accessToken:(userId)=>{
        
        return new Promise((resolve,reject)=>{
            const payload={}
            const secret=process.env.ACCESS_TOKEN
            const options={
                
                issuer:process.env.APP_NAME,
                audience:userId.toString()
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err){
                    console.log(err.message)
                    reject(createError.InternalServerError())
                } 
                resolve(token)
            })
        })

    },



verifyAccessToken:(req,res,next)=>{
    
    if(!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    // console.log(token)
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,payload)=>{
        if(err){
            const message = err.name==='JsonWebTokenError'?"Unauthorized":err.message
            return next(createError.Unauthorized(message))

        }
        req.payload = payload
        next()
    })

},



}