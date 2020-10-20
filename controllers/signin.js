const handleSignin = (req,res,db,bcrypt) => {
	const {email,password} = req.body;

	/*copy from 'register.js'*/
	if (!email || !password) {
		/*if any of these is 'not' true = false*/
		return res.status(400).json('incorrect form submission')
		/*remember to put 'return' here so the function will know this is the end,
		or it'll keep continue the rest of the codes below.*/
	}

	db.select('email','hash').from('login')
		.where({email: email})
		.then(data => {
			/*to compare the entered password is matched to the stored hash in the 'login' table*/
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users').where({email: email})
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('user not found'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}