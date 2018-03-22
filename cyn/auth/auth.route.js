var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful login state
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? {id: req.user.id, username: req.user.username} : null});
	});

	//sends failure login state
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null, message: "Invalid username or password"});
	});

	//sends successful signout state
	router.get('/signoutsuccess', function(req, res){
		res.send({state: 'success', user: null, message: "Signout Success"});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/auth/signoutsuccess');
	});

	return router;

}