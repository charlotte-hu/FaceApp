const handleProfile = (req,res,db) => {
	const { id } = req.params; /*params is whatever we input after route*/
	/*just to grab the user info with certain id*/
	db.select('*').from('users').where({id: id})
		.then(user => {
			/*if user not found, it'll return an empty array*/
			if (user.length) {
				res.json(user[0]);
				/*user[0] here is only to grab the only item in the object
				because it should only return one item since the id is unique
				but it's returning the whole object*/
			} else {
				res.status(400).json('User not found')
			}
		})
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleProfile: handleProfile
}