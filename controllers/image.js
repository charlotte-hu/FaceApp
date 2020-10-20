const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: 'b550ff4a920b4f6895c674c0434f85d8'
});

const handleApiCall = (req,res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
											/*originally: this.state.input*/
		.then(data => {
			res.json(data);
		})		
		.catch(err=> res.status(400).json('unable to work with API'))					
};

	/*here has to use 'this.state.input' because there's no still value to 'this.state.image', 'image' only
	got to set state at the same moment the button was submitted. so can't use it. */
	/*Teacher's instruction: Calling setState() in React is asynchronous, for various reasons (mainly performance). 
	Under the covers React will batch multiple calls to setState() into a single call, and then re-render the 
	component a single time, rather than re-rendering for every state change. Therefore the imageUrl parameter 
	would have never worked in our example, because when we called Clarifai with our the predict function, 
	React wasn't finished updating the state. 
	One way to go around this issue is to use a callback function: setState(updater, callback)*/



const handleImage = (req,res,db) => {
	const { id } = req.body; /*params is whatever we input after route*/
	db('users')
	  .where({id: id}) /*this equals to ('id', '=', id)*/
	  .increment('entries', 1)
	  .returning('entries')
	  .then(entries => {
	  	res.json(entries[0]);
	  })
	  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}