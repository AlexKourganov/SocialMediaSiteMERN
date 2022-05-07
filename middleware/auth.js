import jwt from 'jsonwebtoken';


const auth = async(req,res,next)=>{
    try {
        console.log(process.env.SECRET_KEY)
        const token = req.headers.authorization.split(" ")[1];
        
        // two different tokens one from google or one from mongo, if >500 then google
        const isCustomAuth = token.length<500;
        let decodedData;

        if(token && isCustomAuth){
            decodedData = jwt.verify(token,process.env.SECRET_KEY);

            req.userId = decodedData?.id;

        }else{
            decodedData=jwt.decode(token);
            // sub is googles name for specific id of a user
            req.userId = decodedData?.sub;
        }
        next();

    } catch (error) {
        console.log(error)
    }
}

export default auth;