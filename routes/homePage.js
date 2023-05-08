const express = require("express");
const path = require("path")
const router = express.Router();
const data = require("../data");
const showcaseData = data.showcases;
const userData = data.users;
const commentData = data.comments;
const formidable = require('formidable');


router.get('/', async (req, res) => {
    try {

        let userLogin = null;

        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }

        let showcaseArr = await showcaseData.getAllShowcase();

        for (let i = 0; i < showcaseArr.length; i++) {
            let temp = await userData.getUserById(showcaseArr[i].userId);
            showcaseArr[i].userNickname = temp.nickname;
        }

        showcaseArr.sort((a,b)=>{
            return (b.viewCount-a.viewCount);
        })
        // res.send({ showcaseArr, userLogin });

        res.render('home/home.handlebars', { showcaseArr, userLogin });
        
    } catch (error) {
        res.redirect('/homePage');
        // res.status(404).send(error);
    }
});


router.get('/tag', async (req, res) => {

    try {
        let userLogin = null;
        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }
        if (!req.query)
            throw "TagInfo needed";
        if (!req.query.searchTag)
            throw "Please provide a valid tag";
        
        let showcaseArr = await showcaseData.getShowcaseByOneTag(req.query.searchTag);
        res.render('home/home.handlebars', { showcaseArr, userLogin });
    } catch (error) {
        res.status(404).send(error);
    }

});

router.get("/search", async (req, res) => {

    try {

        let userLogin = null;

        if (req.session) {
            if (req.session.userId)
                userLogin = await userData.getUserById(req.session.userId);
        }

        if (!req.query)
            throw "please provide a valid string to search";

        if (!req.query.searchString)
            throw "please provide a valid string to search";

        let showcaseArr = await showcaseData.getShowcaseByString(req.query.searchString);
        res.render('home/home.handlebars', { showcaseArr, userLogin });

    } catch (error) {

        res.redirect('/homePage')
       
    }
})

router.post('/createShowcase', async (req, res) => {

    let userLogin = null;

    if (req.session) {

        if (req.session.userId)
            userLogin = await userData.getUserById(req.session.userId);

    }

    const form = new formidable.IncomingForm();

    form.uploadDir = path.join(__dirname, '../', 'public', 'images');
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        
        try {
            if (!fields)
                throw "Data needed to create showcase";
            if (!fields.title)
            //title
                throw "Title needed to create showcase"
            if (!fields.article)
            //article
                throw "Article needed to create showcase"
            if (!fields.tagArr)
            //tag
                throw "TagArr needed to create showcase";
            let tagArr = JSON.parse(fields.tagArr);
            if (!Array.isArray(tagArr))
                throw "Tag needed to create showcase";

            let newShowcase = await showcaseData.createShowcase(
                fields.title,
                req.session.userId,
                fields.article,
                tagArr
            )
            res.send(newShowcase);
        } catch (error) {
            res.status(404).send(error);
        }
    })
});

export default router;
