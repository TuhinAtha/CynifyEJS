var LocalStrategy   = require('passport-local').Strategy;
var mongoose = require('mongoose');
var CynAuth = mongoose.model('CynAuthModel');
var bCrypt = require('bcrypt-nodejs');
users = {};
module.exports = function(passport){

	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user.id);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializing user:',id);
		CynAuth.findById(id,function(err, user){
			return done(err, user);
		})
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			CynAuth.findOne({username : username},function(err,user){
				if(err){
					return done(err,false);
				}
				if(!user){
					return done('User Not Found', false);
				}
				if(!isValidPassword(user, password)){
					//sucessfully authenticated
					console.log('Invalid password '+username);
					return done(null, false);
				}
				return done(null, user)
			})			
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, username, password, done) {
			CynAuth.findOne({username : username},function(err,rs){
				if(err){
					return done(err,false);
				}
				if(rs){
					return done('User already exists', false);
				}
				var cynAuth = new CynAuth();
				cynAuth.username = username;
				cynAuth.password = createHash(password);
				cynAuth.save(function(err,rs){
					if(err){
						return done(err,false);
					}
					return done(null,rs);
				});
			});
		})
	);
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};
}