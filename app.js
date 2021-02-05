const express 		= require("express"),
 	  app 			= express(),
	  bodyParser 	= require("body-parser"),
 	  mongoose 		= require("mongoose"),
	  passport		= require('passport'),
	  localStrategy = require('passport-local'),
	  Campground 	= require("./models/campground"),
	  seedDB		= require("./seeds"),
	  Comment 		= require('./models/comment'),
	  User 			= require('./models/user'),
	  methodOverride = require('method-override'),
	  flash			 = require('connect-flash')
	  
const commentRoutes = require('./routes/comments'),
	  campgroundRoutes = require('./routes/campgrounds'),
	  indexRoutes = require('./routes/index')


// create yelp camp database in mongo
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))
app.use(flash())

// passport config
app.use(require('express-session')({
	secret: "Stella is the cutest dog",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// pass in variables across all the templates
app.use(function(req, res, next){
	res.locals.currentUser = req.user
	res.locals.error = req.flash('error')
	res.locals.success = req.flash('success')
	next()
})

// connect the app variable with the route files
app.use(indexRoutes)
// append /campgrounds to all campground & comment routes
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

// server setup
app.listen(3000, function(){
	console.log("YelpCamp Server has started.")
})