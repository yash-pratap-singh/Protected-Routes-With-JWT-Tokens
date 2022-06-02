require('dotenv').config();
const express=require('express');
const app=express();
PORT=process.env.PORT||3000;
const authenticateUser=require('./middlewares/authentication');

//connect DB
const connectDB=require('./db/connect');

// Routers
const authRouter=require('./routes/auth');
const jobRouter=require('./routes/jobs');


// Middlewares
app.use(express.json());


// Routes
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/job',authenticateUser,jobRouter);


const start=async()=>{
    try{
    // await connectDB(process.env.MONGO_URI);
    app.listen(PORT,console.log(`Server is running on PORT ${PORT}`));
    }catch(error){
        console.log(error);
    }
}
start();
