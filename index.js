import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';


const app = express();
dotenv.config();

// All routs that start with /posts


// precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors());
// Cors needs to be above our routes to solve the cors error
app.use('/posts',postRoutes);
app.use('/user',userRoutes);

app.get('/',(req,res)=>{
    res.send('APP IS RUNNING!')
})

// mongo cloud atlas
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>app.listen(PORT,()=>{
    // console.log(process.env.SECRET_KEY)
    console.log(`Server is running on PORT: ${PORT}`)
}))
.catch((error)=>{
    console.log(error.message)
});
// dont get warnings in a console
// mongoose.set('useFindAndModify',false);