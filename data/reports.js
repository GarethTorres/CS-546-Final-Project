import { ObjectId } from 'mongodb';
import { reports } from '../config/mongoCollection.js';

async function getAllReports() {

    try 
    {
        const reportCollection = await reports();
        const allReports = await reportCollection.find({}).toArray();
        return allReports;
    } 

    catch (error) 
    {
        console.log(error);
    }
}

async function getReportById(id) {

    if (!id) 
    {
        throw new error ('Pleaseprovide an id to search');
    }
    
    else if(typeof id =="string")
    {
        const objId = ObjectId.createFromHexString(id);
        id = objId;
    }

    const reportCollection = await reports();
    const reportTrack = await reportCollection.findOne({_id: id});

    if (reportTrack === null) throw 'No report found with that id';

    return reportTrack;

}

async function addReport(userId,showcaseId,reason){

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
    
    else if (!reason) {
        throw new Error('That reason parameter should exists');
        // /That reason  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (!Array.isArray(reason)) {
        throw new Error('That reason parameter should exists');
        // /That reason parameter should be proper type (string). If not, throw an error.
    }
    
    const reportCollection = await reports();
    const existReport = await reportCollection.findOne({userId: userId, showcaseId: showcaseId}); 
    
    if(existReport == null)

    {
        const newReport = {
            userId: userId,
            showcaseId: showcaseId,
            reasons: reason
        };

        const insertInfo = await reportCollection.insertOne(newReport);

        if (insertInfo.insertedCount === 0) {
            throw new errror ('Could not add report');
        }

        const newId = insertInfo.insertedId;
        const reportAdd = await this.getReportById(newId);
        return reportAdd;
    }

    else{
        throw "You reported that showcase already"
    };
}

async function removeReport(reportId) {

    if (!reportId) {
        throw new Error('That report parameter should exists');
        // /That report  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof reportId !== "string") {
        throw new Error('That report parameter should be proper type (string)');
        // /That report parameter should be proper type (string). If not, throw an error.
    }   
   
    const reportObjId = ObjectId.createFromHexString(reportId);
    const reportData = await reports()
    const checkDelete = await reportData.removeOne({ _id: reportObjId });

    if (checkDelete.deletedCount === 0) {
        throw new Error(`Can not delete report with the id of ${reportId}`);
    }

    return true;
}

export {
    getAllReports,
    getReportById,
    addReport,
    removeReport
    };

