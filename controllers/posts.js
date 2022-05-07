import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';


export const getPosts = async (req,res) =>{
    const {page} = req.query;
    try{
        // Limit of posts
        const LIMIT = 8;
        // Starting index of every page
        const startIndex = (Number(page) -1)*LIMIT;
        // How many posts in total
        const total = await PostMessage.countDocuments({});

        // newestpost first /skip the unwanted ones
        const posts = await PostMessage.find().sort({_id:-1}).limit(LIMIT).skip(startIndex);
       
        res.status(200).json({data:posts, currentPage:Number(page), numberOfPages:Math.ceil(total/LIMIT)});
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

export const getPost = async (req,res) =>{
    const {id} = req.params;
    try {
            const post = await PostMessage.findById(id);
            res.status(200).json(post);
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}

// Query -> /posts?page=1->page=1
// Params-> /posts/:id->id=1
export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;

    try {
        const title = new RegExp(searchQuery, "i");

        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: posts });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const createPost = async (req,res) =>{
    const post = req.body;

    const newPost = new PostMessage({...post, creator:req.userId,createdAt:new Date().toISOString()});

    try{
         await newPost.save();
         res.status(201).json(newPost)
    }catch(error){
        res.status(404).json({message:error.message})
    }
}

export const updatePost = async (req,res) =>{
    const {id:_id} = req.params;
    const post = req.body;

    // Mangoose database also has object _id
 

    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post With Such Id Exist;');

    const updatedPost = await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new:true});
    res.json(updatedPost);


}

export const deletePost = async (req,res) =>{
    const {id:_id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post With Such Id Exist;');
     await PostMessage.findByIdAndDelete(_id);
     res.json({message:'Post Deleted successfully!'});

}

export const likePost = async (req,res) =>{
    const {id:_id} = req.params;

    if(!req.userId) return res.json({message:'Unauthenticared'})


    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No Post With Such Id Exist;');

    const post = await PostMessage.findById(_id);

    const index = post.likes.findIndex((id)=> id === String(req.userId));
    // if id there then he already liked it
    if(index === -1){
        // like the post
        post.likes.push(req.userId);
    }else{
        // Dislike the post
        // return array of all the likes besides this person likes
        post.likes = post.likes.filter((id)=>id !== String(req.userId))
    }
   
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);

}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatedPost);
};



