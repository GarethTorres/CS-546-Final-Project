const express = require("express");
const router = express.Router();
const data = require("../data");
const showcaseData = data.showcases;
const userData = data.users;
const commentData = data.comments;
const reportData = data.reports;

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

router.get('/showcaseInfo/:id', async (req, res) => {
    try {
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        await showcaseData.addViewCount(req.params.id);//Each time this address is accessed, viewCount++
        let showcaseInfo = await showcaseData.getShowcaseById(req.params.id);
        let temp = await userData.getUserById(showcaseInfo.userId);
        showcaseInfo.nickname = temp.nickname;
        let commentsInfo = [];
        for (let i = 0; i < showcaseInfo.commentIdArr.length; i++) {
            let thisComment = await commentData.getCommentById(showcaseInfo.commentIdArr[i]);
            let commentCreaterInfo = await userData.getUserById(thisComment.userId);
            thisComment.userNickname = commentCreaterInfo.nickname;
            commentsInfo.push(thisComment);
        }
        // res.json({ showcaseInfo, commentsInfo, userLogin});
        res.render('showcases/showcases.handlebars', { showcaseInfo, commentsInfo, userLogin });
    } catch (error) {
        res.redirect('/homePage')
        // res.status(404).json({ error: 'Showcase not found' });
    }
});

router.get('/like', async (req, res) => {
    try {
        // console.log(req.query)
        if (!req.session){
            throw new Error ("Cookie needed")
        }
        if (!req.session.userId){
            throw new Error ( "Please login")
        }
        if (!req.query){
            throw new Error ( "More info needed")
        }
        if (!req.query.showcaseId){
            throw new Error ( "showcaseId needed")
        }
        let updatedShowcase = await showcaseData.addLikeCount(req.query.showcaseId, req.session.userId);
        res.send(updatedShowcase);
    } catch (error) {
        // console.log(showcase)
        res.status(404).send(error);
    }
});

router.post('/editContent', async (req, res) => {
    try {
        if (!req.session){
            throw new Error ( "Cookie needed")
        }
        if (!req.session.userId){
            throw new Error ( "login first,then edit content")
        }
        if (!req.body){
            throw new Error ( "need new content and showcaseId")
        }
        if (!req.body.showcaseId){
            throw new Error ( "need showcaseId")
        }
        if (!req.body.newContent){
            throw new Error ( "new Content")
        }
        let showcaseToEdit = await showcaseData.getShowcaseById(req.body.showcaseId);
        if (showcaseToEdit.userId !== req.session.userId){
            throw new Error ( "Your id is not the same as the userId of the showcase!!")
        }
        let updatedShowcase = await showcaseData.editContent(req.body.showcaseId, req.body.newContent);
        res.redirect("http://localhost:3000/users/account");
    } catch (error) {
        res.redirect("http://localhost:3000/users/account");
    }
});

router.post('/delete',async (req, res) =>{
    try{
        if(!req.session) {
            throw new Error ( 'Delete fail(session required)')
        }
        if(!req.session.userId) {throw new Error ( 'Delete fail(userid required)')
        }
        if(!req.body.showcaseId) {throw new Error ( 'Delete fail(showcaseid required)')
        }
        let showcaseInfo=await showcaseData.getShowcaseById(req.body.showcaseId);
        // console.log(showcaseInfo);
        if(showcaseInfo.userId!==req.session.userId){
             throw new Error ( "userId did not match")
        }
        //if not the same user
        let showcaseDelete = await showcaseData.removeShowcase(req.body.showcaseId);
        // res.redirect("http://localhost:3000/users/account");
        res.send(showcaseDelete);
        // if(showcaseDelte)
        //     res.send(true);
        // else
        //     res.send(false);
    }catch(error){
        res.status(404).send(error);
    }
})

router.post('/addComment', async (req, res) => {
    try {
        if (!req.session){
            throw new Error ( "Cookie needed")
        }
        if (!req.session.userId){
            throw new Error ( "login first,then make commnet")
        }
        if (!req.body){
            throw new Error ( "need info to create a comment")
        }
        if (!req.body.showcaseId){
            throw new Error ( "need showcaseId to create a comment")
        }
        if (!req.body.commentContent){
            throw new Error ( "need commentContent to create a comment")
        }
        let newComment = await commentData.addComment(req.body.showcaseId, req.session.userId, req.body.commentContent)
        res.redirect("http://localhost:3000/showcases/showcaseInfo/"+req.body.showcaseId);
    } catch (error) {
        res.redirect("http://localhost:3000/showcases/showcaseInfo/"+req.body.showcaseId);
    }
});

router.post('/deleteComment', async (req, res) => {
    try {
        
        if (!req.session){
            throw new Error ( "Cookie needed to delete the comment")
        }
        if (!req.session.userId){
            throw new Error ( "login first,then delete commnet")
        }
        if (!req.body){
            throw new Error ( "need info to delete the comment")
        }
        if (!req.body.showcaseId){
            throw new Error ( "need showcaseId to delete the comment")
        }
        if (!req.body.commentId){
            throw new Error ( "need commentId to create the comment")
        }
        await commentData.removeComment(req.body.showcaseId,req.body.commentId);
        res.redirect("http://localhost:3000/showcases/showcaseInfo/"+req.body.showcaseId);
    } catch (error) {
        res.status(404).send(error);
    }
});

router.post('/removeReport', async (req, res) => {
    //browser request get by Ajax
    try {
        //console.log(req.body.reportId);
        if (!req.session){ 
            throw new Error ( 'Delete fail(session required)')
        }
        if (!req.session.userId){
             throw new Error ( 'Delete fail(userId required)')
        }
        if (!req.body.reportId) {
            throw new Error ( 'Delete fail(reportId required)')
        }
        let deletePerson = await userData.getUserById(req.session.userId)
        let showcaseDelete = null;
        if (deletePerson.admin === false)
            res.send("You should not be here")
        else {
            //res.send(req.body.reportId)
            // showcaseDelete = await showcaseData.removeShowcase(req.body.showcaseId);
            reportDelete = await reportData.removeReport(req.body.reportId);
            res.send(reportDelete);
        }

    } catch (error) {
        res.status(404).send(error);
    }
})

router.post('/removeReportAndShowcase', async (req, res) => {
    try {

        if (!req.session) {
            throw new Error ( 'Delete fail(session required)')
        }
        if (!req.session.userId) {
            throw new Error ( 'Delete fail(userId required)')
        }
        if (!req.body.reportId) {
            throw new Error ( 'Delete fail(reportId required)')
        }

        let deletePerson = await userData.getUserById(req.session.userId)
        let showcaseDelete = null;
        
        if (deletePerson.admin === false)
            res.send("You should not be here")

        else {
            //res.send(req.body.reportId,req.body.showcaseId)
            showcaseDelete = await showcaseData.removeShowcase(req.body.showcaseId);
            reportDelete = await reportData.removeReport(req.body.reportId);
            res.send(true);
        }

    } catch (error) {
        res.status(404).send(error);
    }
})

export default router;


