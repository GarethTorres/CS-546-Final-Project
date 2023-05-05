const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require('bcryptjs');
const saltRounds = 5;
const userData = data.users;
const showcaseData = data.showcases;

router.get('/account', async (req, res) => {

    if (!req.session.userId) {	

		return res.redirect('/homePage');

	}
	try{

		const userId = req.session.userId;  
		const userLogin = await userData.getUserById(userId);

		let showcases=[];
		for(let x of userLogin.showcases)

		{
			const oneShowcase = await showcaseData.getShowcaseById(x);
			showcases.push(oneShowcase);
		}

		res.render('users/useraccount',{username: userLogin.username, 'showcase-list':showcases, userLogin});
	
	}catch(e){

		res.status(404).json({ error: 'User not found' });

	}
	
});

router.get('/signin', async (req, res) => {

	if (req.session.userId) {		
		return res.redirect('/homePage');
	}
    res.render('home/signin');
});

router.post('/signin', async (req, res) => {

	if (req.session.userId) {		
		return res.redirect('/homePage');
	}
	const { username, password } = req.body;
	const allUser = await userData.getAllUsers();

	for (let x of allUser)
    {

		if(username == x.username)
        {
			if(await bcrypt.compare(password, x.password))   
            {
				req.session.userId = x._id.toHexString(); 
                return res.redirect('/homePage');
			}
            break;
        }
    }
    res.status(401).render('home/signin',{message:"Invalid account or password"});
});

router.get('/signup', async (req, res) => {

    if (req.session.userId) {	

		return res.redirect('/homePage');

	}
	res.render('home/signup');
});

router.post('/signup', async (req, res) => {

	const { username,password} = req.body;

	try{
		if (!username) {
			throw `Please provide a valid username`
		}
		if (!password[0]) {
			throw `Please provide a valid password`
		}
		if (!password[1]) {
			throw `Please check the password you inputted`
		}
		if(password[0]!=password[1])
		{
			throw `Password doesn't match`
		}
  		const hash = await bcrypt.hash(password[0], saltRounds);
		const newUser = await userData.createUser(username,hash);

		req.session.userId = newUser._id.toHexString(); 
        return res.redirect('/homePage');

	}catch(e)
	{
		res.status(404).render('home/signup',{message:e});
	}
});

router.get('/signout', async (req, res) => {

	if (!req.session.userId) {		
		return res.redirect('/homePage');
	}
	req.session.destroy();
    return res.redirect('/homePage');

});

router.post('/account', async (req, res) => { 

	let { username, password,Cpassword } = req.body;
	const userId = req.session.userId; 
	let oldUser;
	let showcases=[];

	try {
		oldUser = await userData.getUserById(userId);
	} catch (e) {
		res.status(404).json({ error: 'User did not found' });
		return;
	}

	try {
		let success1;
		let success2;
		let success3;

		if (username == oldUser.username) {
			throw new Error ("Please try another username"); 
		}
		if (password == oldUser.password) {
			throw new Error ("Please try another password"); 
		}
		if (password != Cpassword) {
			throw new Error ("Password did not match"); 
		}
		
		if(username)
		{
			await userData.editUsername(userId, username );
			success1 ="Username has been updated";
		}else if(password)
		{
			const hash = await bcrypt.hash(password, saltRounds);
			await userData.editPassword(userId, hash );
			success3 ="Password has been updated";
		}
		else throw`Please use different inputs before continue`;

		let updatedUser = await userData.getUserById(userId);

		for(let x of updatedUser.showcases)
		{
			const oneShowcase = await showcaseData.getShowcaseById(x);
			showcases.push(oneShowcase);
		}
		res.render('users/useraccount',{username: updatedUser.username, 'showcase-list':showcases, success1:success1,success2:success2,success3:success3, userLogin: updatedUser});
	} catch (e) { 

		let message1;
		let message3;
		let message4;

		if(e =="Please try another username")message1 ="Please try another username";
		if(e =="the username is already exisited")message1 ="The username is already exisited";
		if(e =="Please try another password")message3="Please try another password";
		if(e =="Password did not match")message3="Password did not match";
		if(e =="Please use different inputs before continue")message4="Please use different inputs before continue";
		
		const oldUsername = oldUser.username;

		for(let x of oldUser.showcases)
		{
			const oneShowcase = await showcaseData.getShowcaseById(x);
			showcases.push(oneShowcase);
		}
		res.status(404).render('users/useraccount',{username: oldUsername, 'showcase-list':showcases, message1:message1, message3:message3, message4:message4, userLogin: oldUser});
	}
});

router.get("/", async (req, res) => {
	try {
      const userList = await userData.getAllUsers();
      res.json(userList);
    } catch (e) {
      res.status(500).send();
    }
});

export default router;


