const mongoose=require('mongoose');
// const { use } = require('../routes/auth');
const bcrypt=require('bcryptjs');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlength:3,
        maxlength:20
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match:[/[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/,'Please provide valid email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please provide Password'],
        minlength:3,
    }
});

userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();
})

userSchema.methods.createJWT=function(){
    return jwt.sign({userID:this._id, name: this.name},process.env.JWT_SECRET,{expiresIn:'60s'});
}

userSchema.methods.comparePassword=async function(candidatePassword){
    const isCorrect=await bcrypt.compare(candidatePassword,this.password);
    return isCorrect;
}



module.exports=mongoose.model('User',userSchema);