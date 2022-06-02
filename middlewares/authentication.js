const User=require('../model/User');
const jwt=require('jsonwebtoken');
const {StatusCodes}=require('http-status-codes');


const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer '))
    return res.status(StatusCodes.UNAUTHORIZED).json('Authentication Invalid');

    const token=await authHeader.split(' ')[1];

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        req.user={name :decoded.name,userID:decoded.userID};
        next();
    }catch(err)
    {
        return res.status(StatusCodes.UNAUTHORIZED).json({msg:'Authententication Invalid'});
    }
}

module.exports=auth