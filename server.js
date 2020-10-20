const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1', /*same meaning as 'localhost'*/
    user : 'postgres',
    password : '1234',
    database : 'smartbrain'
  }
});

/*to select all from 'users' table from database*/
/*this is actually returning a 'promise', so if we want to grab the
info from this request, we have to do 'then' following that. Don't need
'.json()' because it's not sending through HTTP*/

// db.select('*').from('users').then(data => {
// 	console.log(data);
// });


const app = express();

app.use(express.json());
/*make sure to have this so the express will know the data sending from
front end could be encoding from JSON to what we can read here*/

app.use(cors());
/*this will let the Browser (google or IE) to know localhost we would like
to fetch is a trustable source*/

/*ROOT ROUTE*/
app.get('/', (req,res) => {
	res.send('success');
});


/*SIGNIN ROUTE - we can see the exact response we'll get where we defined
in the 'Signin' component in React project*/ 
app.post('/signin', (req,res) => {signin.handleSignin(req,res,db,bcrypt)});


/*REGISTER ROUTE*/
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});
												/*this is 'dependency injection' where
												we are injecting whatever dependencies
												this handleRegister function need*/

/*PROFILE ROUTE*/
app.get('/profile/:id', (req,res) => {profile.handleProfile(req,res,db)});

/*
here we can't do 'forEach' with 'if' and 'else' the condition of 
finding the user id, because forEach loop will keep looping without
having it return. And once it was found with the id, it should return
something and don't really need to keep looping. And the usernotfound
will only be trigger when the 'found' is false.
*/


/*IMAGE ROUTE - using PUT as to update everytime the image uploaded*/
app.put('/image', (req,res) => {image.handleImage(req,res,db)});


/*To use 'bcrypt' a way to hash a password, to compare a password*/
// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });
/*so this could be used in 'Register' where to store the password*/

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true

// 	/*this is where it'll compare the 'hash' which is password in disguised
// as a long codes with the true password. The response will be either true
// when it matched, or false if it doesn't match.*/
// });

// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });
/*This could be used in 'signin' where to retrieve and compare the password*/


/*IMAGE URL ROUTE - using POST as to send request out with image url*/
app.post('/imageurl', (req,res) => {image.handleApiCall(req,res)});



app.listen(3001, () => {
	console.log('app is running on port 3001');
});



/*

Path of building API Endpoints & testing them with Postman

/ --> res = this is working

/signin --> POST = success/fail (this will return success/fail)

/register --> POST = user

/profile/:userId --> GET = user

/image --> PUT = user (linked to the user ranking as how many photos has been uploaded,
so it's to update user's profile)


*/