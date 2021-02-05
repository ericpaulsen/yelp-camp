const express = require('express'),
	  router  = express.Router(),
	  passport = require('passport'),
	  User = require('../models/user')

// root route
router.get("/", function(req, res){
	res.render("landing")
})

// ===================
// AUTH ROUTES
// ===================

// show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req, res){
// 	create new user in mongo
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
			console.log(err)
            return res.render("register", {'error': err.message});
        }
// 		log new user in
        passport.authenticate("local")(req, res, function(){
		   req.flash('success', 'Welcome to YelpCamp ' + user.username)
           res.redirect("/campgrounds"); 
        });
    });
});

// SHOW - login
router.get('/login', function(req, res){
	res.render('login')
})

// login logic
router.post('/login', passport.authenticate('local', 
	{
	successRedirect: "/campgrounds",
	failureRedirect: '/login'
	}), function(req, res){	
	req.flash('success', 'Logged in.')
})

// logout logic
router.get('/logout', function(req, res){
	req.logout()
	req.flash('success', "Successfully logged out.")
	res.redirect('/campgrounds')
})


module.exports = router