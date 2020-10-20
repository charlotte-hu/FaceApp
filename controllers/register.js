/*Pull this whole Register function out to separate file. While need to make sure
the 'db' and 'bcrypt' source got moved as well. So in 'server.js' file we do 'dependencies
injection', which is to inject whatever dependencies that 'handleRegister' function
will need, including 'db' and 'bcrypt'*/


const handleRegister = (req,res,db,bcrypt) => {
	const {email,name,password} = req.body;

	/*This condition could help us do a security check, while the
	user has to input something in the box before submitting. No
	blank allow.*/
	if (!email || !name || !password) {
		/*if any of these is 'not' true = false*/
		return res.status(400).json('incorrect form submission')
		/*remember to put 'return' here so the function will know this is the end,
		or it'll keep continue the rest of the codes below.*/
	}

	/*use 'bcrypt' for safely storing password*/
	const hash = bcrypt.hashSync(password);

	/*use transaction 'trx' to bundle the updated to both tables together*/
	db.transaction(trx => {
		/*first step, to insert the pw and email into 'login' table*/
		return trx('login')
		.insert({
			hash: hash,
			email: email
		})
		// .into('login')
		/*returning the email we just had*/
		.returning('email')
		/*use the data that just returned: email from 'login' table*/
		/*to insert it into the 'users' table*/
		.then(loginEmail => {
			/*make sure using 'return' here*/
			return trx('users')
			.insert({
				email: loginEmail[0], /*because the 'returning' returned an array*/
				name: name,
				joined: new Date()
			})
			.returning('*')
			.then(user => {
				res.json(user[0]) /*make sure to have a response here!!*/
			})
		})
		.then(trx.commit) /*if the transation successfully run*/
		.catch(trx.rollback) /*if the transation didn't get through*/
	})
	.catch(err => res.status(400).json(err))
}

module.exports = {
	handleRegister: handleRegister
}