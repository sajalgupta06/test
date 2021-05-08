const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Schema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
   

    
 
})

Schema.pre('save',async function(next){
    try {
        const salt =await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password,salt )
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})
Schema.methods.isValidPassword=async function (password){
    try {
        return await bcrypt.compare(password,this.password)
    } catch (error) {
        throw error
    }
}

const User = mongoose.model('user',Schema)

module.exports = User