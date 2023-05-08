import express from 'express';
const router = express.Router();
const data = require("../data");
import { comments as commentData } from '../data/index.js';
import { showcases as showcaseData } from '../data/index.js';

router.get("/:id",async function(req,res) {
  // Get a specific comment by ID
    try{
        const commentInfo = await commentData.getComment(req.params.id); 
        // title, user(id), showcase(id), article, date
        // console.log(req.params.id)
        res.json(commentInfo);
    }
    catch(e){
        res.status(404).json({message:"Comment not found"});
    }
});

router.get("/",async function(req,res) {
  // Get all comments
    try{
        const commentList = await commentData.getAll();
        res.json(commentList);
    }
    catch(e){
        res.status(500).send();
    }
});

router.post("/", async(req, res) => { 
  // Add a new comment
    let commentInfo = req.body;
    if (!commentInfo) {
        res.status(400).json({ error: 'You must provide data to create a comment' });
        return;
      }

    const {title, user, showcase, content} = commentInfo;
    if (!title || typeof title !== 'string') {
        res.status(400).json({ error: 'You must provide a title(String) for the comment' });
        return;
    }
    if (!user) {
        res.status(400).json({ error: 'You must provide user id for the comment' });
        return;
    }
    if (!showcase) {
        res.status(400).json({ error: 'You must provide showcase id for the comment' });
        return;
    }
    if (!content || typeof content !== 'string') {
        res.status(400).json({ error: 'Comment content can not be empty.' });
        return;
    }

    try {
        const newComment = await commentData.addComment(title, user, showcase, content);
        res.status(200).send(newComment)
    }catch(e){
        res.status(500).json({error:e})
    }
});

router.delete("/:id", async (req, res) => {

  // Delete a comment by ID
    try {
      await commentData.getComment(req.params.id);
    } catch (e) {
      res.status(404).json({ error: "No Comment found" });
    }
    try {
      const msg = await commentData.remove(req.params.id);
      res.status(200).send(msg)
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

// This function should be added into "data/showcases.js"
// Get a list of comment IDs in a showcase

  async function getListOfCommentsInShowcase(showcaseId){
    const thisShowcase = await post.getListOfCommentsInShowcase(showcaseId);
    const listOfComments = thisShowcase.comments; 
    // an array of IDs
    return listOfComments;
  }


  export default router;



