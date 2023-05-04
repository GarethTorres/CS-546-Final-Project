import { ObjectId } from 'mongodb';
import { users } from '../config/mongoCollections';

async function createUser(username, password, genre, email, phone_number, firstName, lastName, organization, city, state, country) {

    if (!username) {
        throw new Error('That username parameter should exists');
        // That username  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof username !== "string") {
        throw new Error('That username parameter should be proper type (string)');
        // That username parameter should be proper type (string). If not, throw an error.
    }

    else if (!password) {
        throw new Error('That password parameter should exists');
        // That password  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof password !== "string") {
        throw new Error('That password parameter should be proper type (string)');
        // That password parameter should be proper type (string). If not, throw an error.
    }

    else if (!genre) {
        throw new Error('That genre parameter should exists');
        // That genre  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof genre !== "string") {
        throw new Error('That genre parameter should be proper type (string)');
        // That genre parameter should be proper type (string). If not, throw an error.
    }

    else if (!email) {
        throw new Error('That email parameter should exists');
        // That email  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof email !== "string") {
        throw new Error('That email parameter should be proper type (string)');
        // That email parameter should be proper type (string). If not, throw an error.
    }

    else if (!phone_number) {
        throw new Error('That phone_number parameter should exists');
        // That phone_number  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof phone_number !== "string") {
        throw new Error('That phone_number parameter should be proper type (string)');
        // That phone_number parameter should be proper type (string). If not, throw an error.
    }

    else if (!firstName) {
        throw new Error('That firstName parameter should exists');
        // That firstName  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof firstName !== "string") {
        throw new Error('That firstName parameter should be proper type (string)');
        // That firstName parameter should be proper type (string). If not, throw an error.
    }

    else if (!lastName) {
        throw new Error('That lastName parameter should exists');
        // That lastName  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof lastName !== "string") {
        throw new Error('That lastName parameter should be proper type (string)');
        // That lastName parameter should be proper type (string). If not, throw an error.
    }

    else if (!organization) {
        throw new Error('That organization parameter should exists');
        // That organization  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof organization !== "string") {
        throw new Error('That organization parameter should be proper type (string)');
        // That organization parameter should be proper type (string). If not, throw an error.
    }

    else if (!city) {
        throw new Error('That city parameter should exists');
        // That city  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof city !== "string") {
        throw new Error('That city parameter should be proper type (string)');
        // That city parameter should be proper type (string). If not, throw an error.
    }

    else if (!state) {
        throw new Error('That state parameter should exists');
        // That state  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof state !== "string") {
        throw new Error('That state parameter should be proper type (string)');
        // That state parameter should be proper type (string). If not, throw an error.
    }

    else if (!country) {
        throw new Error('That country parameter should exists');
        // That country  parameter exists and is of the proper type (string). If not, throw an error.
    }

    else if (typeof country !== "string") {
        throw new Error('That country parameter should be proper type (string)');
        // That country parameter should be proper type (string). If not, throw an error.
    }

    const userCollection = await users();
    const usernameExist = await userCollection.findOne({ username: username });
    
    if (usernameExist !== null){
        throw new Error ("The username already exists");
    }

    const newUser = {
        username: username,
        password: password,
        genre: genre,
        email: email,
        phone_number: phone_number,
        firstName: firstName,
        lastName: lastName,
        organization: organization,
        city: city,
        state: state,
        country: country,
        showcases: [],
        comments: [],
        Admin: false
    };

    const newInsertInformation = await userCollection.insertOne(newUser);

    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId);

};

async function getUserById(userId) { 

    const userCollection = await users();

    if (typeof userId == "string") {
        const objId = ObjectId.createFromHexString(userId);
        userId = objId;
    }

    const user = await userCollection.findOne({ _id: userId });

    if (!user) throw 'User not found';

    return user;
};

async function getAllUsers() {

    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    return userList;

};

async function setAdminAccess(userId) {

    if (!userId) {
        throw new Error('That userId parameter should exists');
        // That userId  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof userId !== "string") {
        throw new Error('That userId parameter should be proper type (string)');
        // That userId parameter should be proper type (string). If not, throw an error.
        }

    const userObjId = ObjectId.createFromHexString(userId);
    const userCollection = await users();
    const userUpdateInfo = {
        Admin:true
    };
    const updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not set Admin access successfully';
    }

    return this.getUserById(userId);

};

async function editPassword(userId, password) {

    if (!userId) {
        throw new Error('That userId parameter should exists');
        // That userId  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof userId !== "string") {
        throw new Error('That userId parameter should be proper type (string)');
        // That userId parameter should be proper type (string). If not, throw an error.
        }

    else if (!password) {
        throw new Error('That password parameter should exists');
        // That password  parameter exists and is of the proper type (string). If not, throw an error.
        }
        
    else if (typeof password !== "string") {
        throw new Error('That password parameter should be proper type (string)');
        // That password parameter should be proper type (string). If not, throw an error.
            }

    const userObjId = ObjectId.createFromHexString(userId);
    const userCollection = await users();
    const userUpdateInfo = {
        password: password
    };

    const updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not edit the password successfully';
    }
    return this.getUserById(userId);

};

async function editUsername(userId, username) {

    if (!userId) {
        throw new Error('That userId parameter should exists');
        // That userId  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof userId !== "string") {
        throw new Error('That userId parameter should be proper type (string)');
        // That userId parameter should be proper type (string). If not, throw an error.
        }

    else if (!username) {
        throw new Error('That username parameter should exists');
        // That username  parameter exists and is of the proper type (string). If not, throw an error.
        }
    
    else if (typeof username !== "string") {
        throw new Error('That username parameter should be proper type (string)');
        // That username parameter should be proper type (string). If not, throw an error.
        }

    const userObjId = ObjectId.createFromHexString(userId);
    const userCollection = await users();
    const usernameExist = await userCollection.findOne({ username: username });

    if (usernameExist){
        throw new Error ("the username is already exisited");
    }

    else {
        const userUpdateInfo = {
            username: username
        };
        const updatedInfo = await userCollection.updateOne({ _id: userObjId }, { $set: userUpdateInfo });

        if (updatedInfo.modifiedCount === 0) {
            throw 'could not edit the username successfully';
        }
        return this.getUserById(userId);
    }
};

async function addShowcaseToUser(userId, showcaseId) { 

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $addToSet: { showcases: showcaseId } }
    );

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);

};

async function removeShowcaseFromUser(userId, showcaseId) { 

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne(
        { _id: ObjectId(userId) },
        { $pull: { showcases: showcaseId } }
    );
    
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(userId);
};

export {
    createUser,
    getUserById,
    getAllUsers,
    editUsername,
    editPassword,
    addShowcaseToUser,
    removeShowcaseFromUser,
    setAdminAccess
}


