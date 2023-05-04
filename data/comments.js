import { ObjectId } from 'mongodb';
import { comments } from '../config/mongoCollections';
import { addCommentIdToShowcase, removeCommentIdFromShowcase } from './showcases.js';
import showcasesCollection from './showcases.js';

async function getCommentById(id) {

    //conditions below

    if (!id) {
        throw new Error('That id parameter should exists');
        // /That getCommentById  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof id !== "string") {
        throw new Error('That id parameter should be proper type (string)');
        // /That getMovieById parameter should be proper type (string). If not, throw an error.
    }

    else if (!id.trim()) {
        throw new Error('id must not be empty or contain only spaces');
        //Please check to make sure the getCommentById parameter is not just empty spaces:  If it is, throw an error.
    }

    //conditions end

    const commentCollection = await comments();
    const objId = ObjectId.createFromHexString(id);
    const commentRequest = await commentCollection.findOne({ _id: objId });

    if (commentRequest === null) {
        throw new Error('The id you inputted did not have any comments');
    }

    return commentRequest;

}

async function getAllComments() {

    const commentCollection = await comments();
    const commentsAll = await commentCollection.find({}).toArray();
    return commentsAll;

}

async function addComment(showcaseId, userId, content) {

    if (!showcaseId) {
        throw new Error('That showcase parameter should exists');
        // /That getCommentById  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof showcaseId !== "string") {
        throw new Error('That showcase parameter should be proper type (string)');
        // /That getMovieById parameter should be proper type (string). If not, throw an error.
    }

    else if (!userId) {
        throw new Error('That showcase parameter should exists');
        // /That getCommentById  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof userId !== "string") {
        throw new Error('That showcase parameter should be proper type (string)');
        // /That getMovieById parameter should be proper type (string). If not, throw an error.
    }

    else if (!content) {
        throw new Error('That content parameter should exists');
        // /That getCommentById  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof content !== "string") {
        throw new Error('That content parameter should be proper type (string)');
        // /That getMovieById parameter should be proper type (string). If not, throw an error.
    }

    const commentCollection = await comments();

    const newComment = {
        showcaseId: showcaseId,
        userId: userId,
        content: content,
        date: new Date().toLocaleDateString()
    }
    const insertInfo = await commentCollection.insertOne(newComment);

    if (insertInfo === null)
        throw 'Something wrong when adding the comment';

    const newCommentId = insertInfo.insertedId;
    const commentCreated = await getCommentById(newCommentId.toHexString());

    await showcasesCollection.addCommentIdToShowcase(showcaseId, newCommentId.toHexString());

    return commentCreated;

}

async function removeComment(showcaseId, commentId) {

    if (!showcaseId) {
        throw new Error('That showcase parameter should exists');
        // /That getCommentById  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof showcaseId !== "string") {
        throw new Error('That showcase parameter should be proper type (string)');
        // /That getMovieById parameter should be proper type (string). If not, throw an error.
    }

    else if (!commentId) {
        throw new Error('That comment parameter should exists');
        // /That comment parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof commentId !== "string") {
        throw new Error('That comment parameter should be proper type (string)');
        // /That comment parameter should be proper type (string). If not, throw an error.
    }

    await showcasesCollection.removeCommentIdFromShowcase(showcaseId, commentId);

    const commentObjId = ObjectId.createFromHexString(commentId);
    const commentCollection = await comments();
    const deletionInfo = await commentCollection.removeOne({ _id: commentObjId });

    if (deletionInfo.deletedCount === 0) {
        throw new Error(`Could not delete the comment`);
    }

    // userCollection.removeCommentFromUser(userId,commentId);
    return true;

}

export {
    getCommentById,
    getAllComments,
    addComment,
    removeComment
};


