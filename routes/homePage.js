import express from 'express';
import path from 'path';

import { Router } from "express";
import { users as userData } from '../data/index.js';
import { showcases as showcaseData } from '../data/index.js';
import { comments as commentData } from '../data/index.js';
import { reports as reportData } from '../data/index.js';
import formidable from 'formidable';

const router = express.Router();



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
      if (req.session.userId) {
        userLogin = await userData.getUserById(req.session.userId);
      }
    }
  
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
      try {
        if (!fields) {
          throw "Data needed to create showcase";
        }
        if (!fields.topic) {
          throw "Title needed to create showcase"
        }
        if (!fields.content) {
          throw "Article needed to create showcase"
        }
        console.log(fields.topic)
        console.log(fields.content)
        
        let tagArr = [];
        if (fields.tagArr) {
          tagArr = JSON.parse(fields.tagArr);
          if (!Array.isArray(tagArr)) {
            throw "TagArr should be an array";
          }
        }
        console.log(tagArr)
       
  
        let newShowcase = await showcaseData.createShowcase(
          fields.topic,
          req.session.userId,
          fields.content,
          tagArr
        );
        console.log(newShowcase)
        res.send(newShowcase);
      } catch (error) {
        res.status(404).send(error);
      }
    });
  
    form.on('error', (err) => {
      console.log(err);
    });
  });
  

export default router;
