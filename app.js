const express = require("express")
const morgan = require("morgan")
const createError = require("http-errors")
require("dotenv").config()  
const authRoutes = require("./routes/auth")
const remind = require("./routes/remind")
require('./helpers/init_mongo')
const {verifyAccessToken} = require("./helpers/token")
const app = express()
const compression = require("compression")
const cors = require("cors")

app.use(morgan('dev'))
app.use(compression({
    level:6,
    threshold:10*1000,
}))


app.use(cors({ origin: `${process.env.CLIENT_URL}` }))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/auth',authRoutes)
app.use('/',remind)
app.use(async(req,res,next)=>{
    
    next(createError.NotFound("This route does not exist"))
})
app.use((err,req,res,next)=>{
    
    res.status(err.status||500)
    res.send({
        error:{
            status:err.status||500,
            message:err.message
        }
    })
    
})


app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})




