import * as users from "../data/users.js";
import * as comments from '../data/comments.js';
import * as showcases from '../data/showcases.js';
import * as reports from '../data/reports.js';
import { dbConnection } from "../config/mongoConnection.js";
import {closeConnection} from '../config/mongoConnection.js';
async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    let u1 = await users.createUser("user1","weastrda1","user","user1@gmail.com","6072800001","Alan","Min","virtual","Hoboken","NJ","America");
    let u1_userid = u1._id.toHexString();
    let u2 = await users.createUser("user2","rqrqerrr1","user","user2@gmail.com","6072800002","Tim","Kin","original","Hights","NJ","America");
    let u2_userid = u2._id.toHexString();
    let u3 = await users.createUser("user3","gwefweff1","user","user3@gmail.com","6072800003","Klan","Ti","virtual","LA","CA","America");
    let u3_userid = u3._id.toHexString();
    let u4 = await users.createUser("user4","yeryrtw52","user","user4@gmail.com","6072800004","Putin","Ru","virtual","Shanghai","Shanghai","China");
    let u4_userid = u4._id.toHexString();
    let u5 = await users.createUser("user5","weastrda1","user","user5@gmail.com","6072800005","Hu","Ting","original","NYC","NY","America");
    let u5_userid = u5._id.toHexString();
    let u6 = await users.createUser("user6","gegw3ge21","user","user6@gmail.com","6072800006","Alim","Kaier","virtual","Hoboken","NJ","America");
    let u6_userid = u6._id.toHexString();
    //user1
    let s1 = await showcases.createShowcase(
        "Beautiful Landscape",
        u1_userid,
        "A picture shows the hillside blooms",
        "http://localhost:3000/public/images/hillside.jpg",
        ["Nature", "Scenery","Original"]
    );
    let s1_showcaseid = s1._id.toHexString();
    let s2 = await showcases.createShowcase(
        "Crawlergo",
        u1_userid,
        "A quaint sailboat with many stories on board",
        "http://localhost:3000/public/images/crawlergo.jpg",
        ["Object", "Original", "Oil-painting"]
    );
    let s2_showcaseid = s2._id.toHexString();
    let s3 = await showcases.createShowcase(
        "Guuuuuuuci",
        u1_userid,
        "Fashionable and confident urban beauty",
        "http://localhost:3000/public/images/Guuuuuuuci.jpg",
        ["Character", "Original", "Female"]
    );
    let s3_showcaseid = s3._id.toHexString();
    //user2
    let s4 = await showcases.createShowcase(
        "Robot",
        u2_userid,
        "The heroic mecha warrior glared ahead, as if roaring silently",
        "http://localhost:3000/public/images/Robot.jpg",
        ["Character", "Oil-painting","AI-generated","Male"]
    );
    let s4_showcaseid = s4._id.toHexString();
    let s5 = await showcases.createShowcase(
        "A stray cat proudly",
        u2_userid,
        "A cute cat glares at the viewer in front of it",
        "http://localhost:3000/public/images/cat.jpg",
        ["Animal", "Original", "Watercolor-painting"]
    );
    let s5_showcaseid = s5._id.toHexString();
    //edit user1
    let password1 = await users.editPassword(u1_userid,"fdasnodao1")
    let username1 = await users.editUsername(u1_userid,"Jackey Chen")
    let remove1 = await users.removeShowcaseFromUser(u1_userid,s1_showcaseid)

    //comment
    let comment1 = await comments.addComment(s1_showcaseid,u1_userid,"Wonderful! Hope to see more beautiful articles in the future!")

 

    
    closeConnection()
    console.log('Over');
}


main().catch((error) => {
    console.log(error);
});



    //tags
    //Nature
    //Scenery
    //Original
    //Object
    //Oil_painting
    //Character
    //Male
    //Female
    //AI-generated
    //Watercolor-painting
    //Animal

