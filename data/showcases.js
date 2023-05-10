import { showcases, comments } from '../config/mongoCollection.js';
import { ObjectId } from 'mongodb';
import * as users from "./users.js"


/*
We have 10 properties in the showcase collection
1._id(ShowcaseId):ObjectID
2.userId:string
3.topic:string
4.description:string
5.content:string
6.commentIdArr:arr[string of commentId]
7.tagArr:array[string of tags]
8.likeCount[string of userId]
9.viewCount:number
10.date:Date object
*/

async function createShowcase(topic, userId, content,tagArr) {
    //This function needs to interact with the user collection, and when a showcase is created, the user's showcaseID needs to add a piece of data
    
    if (!topic) {
        throw new Error('That topic parameter should exists');
        // That title  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof topic !== "string") {
        throw new Error('That topic parameter should be proper type (string)');
        // That title parameter should be proper type (string). If not, throw an error.
        }

    else if (!userId) {
        throw new Error('That userId parameter should exists');
        // That userId  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof userId !== "string") {
        throw new Error('That userId parameter should be proper type (string)');
        // That userId parameter should be proper type (string). If not, throw an error.
        }


    else if (!content) {
        throw new Error('That content parameter should exists');
        // That article  parameter exists and is of the proper type (string). If not, throw an error.
        }
            
    else if (typeof content !== "string") {
        throw new Error('That content parameter should be proper type (string)');
        // That tpoic parameter should be proper type (string). If not, throw an error.
        }    

    else if (!description) {
        throw new Error('That description parameter should exists');
        // That article  parameter exists and is of the proper type (string). If not, throw an error.
        }
                
    else if (typeof description !== "string") {
        throw new Error('That description parameter should be proper type (string)');
        // That tpoic parameter should be proper type (string). If not, throw an error.
        }    

    else if (!tagArr) {
        throw new Error('That tagArr parameter should exists');
        // That tagArr  parameter exists and is of the proper type (string). If not, throw an error.
        }
                
    else if (!Array.isArray(tagArr)) {
        throw new Error('That Array parameter should be proper type (string)');
        // That tagArr parameter should be proper type (string). If not, throw an error.
        }    
    
    const showcaseCollection = await showcases();

    let newShowcase = {
        topic: topic,
        userId: userId,
        description: descriptionId,
        content: content,
        commentIdArr: [],
        tagArr: tagArr,
        likeCount: [],
        viewCount: 0,
        date: new Date().toLocaleDateString()
    }

    const insertInfo = await showcaseCollection.insertOne(newShowcase);

    if (insertInfo.insertedCount === 0)
        throw 'Showcase creation failed';

    const newId = insertInfo.insertedId;
    const showcaseCreated = await getShowcaseById(newId.toHexString());

    await users.addShowcaseToUser(userId, newId.toHexString());
    //call the method in the user collection

    return showcaseCreated;
}

async function getAllShowcase() {

    const showcaseCollection = await showcases();
    const showcasesGoal = await showcaseCollection.find({}).toArray();;
    return showcasesGoal;
}

async function getShowcaseById(id) {

    if (!id || typeof id !== "string")
        throw 'Please provide a valid id';

    const showcaseCollection = await showcases();
    const objId = ObjectId.createFromHexString(id);
    const showcaseGoal = await showcaseCollection.findOne({ _id: objId });

    if (showcaseGoal === null)
        throw 'No showcase with that id';

    return showcaseGoal;
}

async function getShowcaseByString(str) {

    if (!str || typeof str !== "string") throw 'Please provide an str to search';
    
    const showcaseCollection = await showcases();
    const re = new RegExp(".*" + str + ".*", "i");
    // let ShowcaseGoal = await showcaseCollection.find({ topic: re }).toArray();

    let ShowcaseGoal = await showcaseCollection.find({ $or: [{ topic: re }, { content: re }] }).toArray();
    // if (ShowcaseGoal === null) throw 'No Showcase with that string';

    return ShowcaseGoal;
}

async function getShowcaseByOneTag(tag) {

    if (!tag || typeof tag !== "string") throw 'Please provide a tag to search';
    
    let showcaseCollection = await showcases();
    let ShowcaseGoal = await showcaseCollection.find({ tagArr: { $elemMatch: { $eq: tag } } }).toArray();
    // if (ShowcaseGoal === null) throw 'No Showcase with that tag';
    
    return ShowcaseGoal;
}

async function getShowcaseByMultTag(tags) {

    if (!tags || !Array.isArray(tags))
        throw "Please provide valid tags"

    const showcaseCollection = await showcases();

    let ShowcaseGoal = await showcaseCollection.find({ tagArr: { $all: tags } }).toArray();
    // if (ShowcaseGoal === null) throw 'No Showcase with that tags';
    return ShowcaseGoal;
}

async function editContent(id, newContent) {
    
    if (!id || typeof id !== "string") throw 'Please provide an id to search';
    if (!newContent || typeof newContent !== "string") throw 'Please provide the new article to update';
    
    const objId = ObjectId.createFromHexString(id);
    const showcaseCollection = await showcases();
    const updatedInfo = await showcaseCollection.updateOne({ _id: objId }, { $set: { content: newContent } });
    
    return await getShowcaseById(id);
}

async function addLikeCount(showcaseId, userId) {

    if (!showcaseId || typeof showcaseId !== "string") throw 'please provide a valid showcase id';
    if (!userId || typeof userId !== "string") throw 'Please provide a valid user id';
    
    const showcaseObjId = ObjectId.createFromHexString(showcaseId);
    const showcaseGoal = await getShowcaseById(showcaseId);
     
    if (showcaseGoal.likeCount.indexOf(userId) !== -1) {
        const index = showcaseGoal.likeCount.indexOf(userId);
        showcaseGoal.likeCount.splice(index, 1);
        const showcaseCollection = await showcases();
        const updatedInfo = await showcaseCollection.updateOne({ _id: showcaseObjId }, { $set: { likeCount: showcaseGoal.likeCount } });

    if (updatedInfo.modifiedCount === 0) {
            throw 'Cancel the likeCount failed';
        }
        return await getShowcaseById(showcaseId);
    }

    else {
        showcaseGoal.likeCount.push(userId);
        const showcaseCollection = await showcases();
        const updatedInfo = await showcaseCollection.updateOne({ _id: showcaseObjId }, { $set: { likeCount: showcaseGoal.likeCount } });
        if (updatedInfo.modifiedCount === 0) {
            throw 'Add likeCount failed';
        }
        return await getShowcaseById(showcaseId);
    }
}

async function addViewCount(showcaseId) {

    if (!showcaseId || typeof showcaseId !== "string") throw 'Please provide a showcase id';
    
    const showcaseObjId = ObjectId.createFromHexString(showcaseId);
    const showcaseGoal = await getShowcaseById(showcaseId);
    const showcaseCollection = await showcases();
    const updatedInfo = await showcaseCollection.updateOne({ _id: showcaseObjId }, { $set: { viewCount: showcaseGoal.viewCount + 1 } });
    
    if (updatedInfo.modifiedCount === 0) {
        throw 'Add the viewCount successfully failed';
    }
    return await getShowcaseById(showcaseId);
}

async function removeShowcase(showcaseId) {

    if (!showcaseId || typeof showcaseId !== "string") throw 'Please provide a valid showcase id';
    
    
    
    const showcaseObjId = ObjectId.createFromHexString(showcaseId);
    const showcaseCollection = await showcases();
    console.log(showcaseObjId)
    const showcaseInfo = await getShowcaseById(showcaseId);
    console.log(showcaseInfo)
    const deletionInfo = await showcaseCollection.deleteOne({ _id: showcaseObjId });
    console.log(deletionInfo)
    if (deletionInfo.deletedCount === 0) {
        throw `Delete the band with id of ${showcaseId} failed`;
    }
    
    await users.removeShowcaseFromUser(showcaseInfo.userId, showcaseId);//call the method in the user collection to remove the showcase id

    return true;
}

async function addCommentIdToShowcase(showcaseId, commentId) {
    
    if (!showcaseId || typeof showcaseId !== "string") throw 'Please provide a showcase id';
    if (!commentId || typeof commentId !== "string") throw 'Please provide a comment id';
    
    const showcaseObjId = ObjectId.createFromHexString(showcaseId);
    const showcaseCollection = await showcases();
    const showcaseGoal = await getShowcaseById(showcaseId);
    showcaseGoal.commentIdArr.push(commentId);
    const updatedInfo = await showcaseCollection.updateOne({ _id: showcaseObjId }, { $set: { commentIdArr: showcaseGoal.commentIdArr } });
    // console.log(updatedInfo);
    
    return true;
}

async function removeCommentIdFromShowcase(showcaseId, commentId) {
    
    if (!showcaseId || typeof showcaseId !== "string") throw 'Please provide a showcase id';
    if (!commentId || typeof commentId !== "string") throw 'Please provide a comment id';
    
    const showcaseObjId = ObjectId.createFromHexString(showcaseId);
    const showcaseCollection = await showcases();
    const showcaseGoal = await getShowcaseById(showcaseId);
    const temp = [];
    
    for (let i = 0; i < showcaseGoal.commentIdArr.length; i++) {
        if (showcaseGoal.commentIdArr[i] !== commentId)
            temp.push(showcaseGoal.commentIdArr[i]);
    }
    showcaseGoal.commentIdArr = temp;
    //const updatedInfo = await showcaseCollection.updateOne({ _id: showcaseObjId }, { $set: { commentIdArr: showcaseGoal.commentIdArr } });
    // console.log(updatedInfo);
    
    return true;
}

async function removeAllCommentsInShowcase(showcaseId) {//the method will delete all the comments in comments collection which has this showcaseId
    
    if (!showcaseId || typeof showcaseId !== "string")
        throw 'Please should input a string as the showcaseId';
        
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.remove({ showcaseId: showcaseId });
    console.log("wwww")
    if (deletionInfo.deletedCount === 0) {
        throw `Delete the comment failed`;
    }
    return true;
}

export {
    createShowcase,
    getShowcaseById,
    getAllShowcase,
    getShowcaseByMultTag,
    getShowcaseByOneTag,
    getShowcaseByString,
    editContent,
    addLikeCount,
    addViewCount,
    removeShowcase,
    addCommentIdToShowcase,
    removeCommentIdFromShowcase,
    removeAllCommentsInShowcase,
    
}

