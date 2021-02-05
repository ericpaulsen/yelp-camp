const express = require('express'),
	  router  = express.Router(),
	  Campground = require('../models/campground'),
	  middleware = require('../middleware')

// ==================
// CAMPGROUND ROUTES
// ==================

// INDEX - all campgrounds route
router.get('/', function(req, res){
// 	get all campgrounds from mongo
	Campground.find({}, function(err, allcampgrounds){
		if(err){
			console.log(err)
		} else {
			res.render("campgrounds/index", {campgrounds:allcampgrounds, currentUser: req.user})
		}
	})
})

// NEW - new campgrounds page
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new.ejs")
})

// CREATE - add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
// 	get data from form and add to the campgrounds array
	let name = req.body.name
	let price = req.body.price
	let image = req.body.image
	let desc = req.body.description
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	let newCampground = {name: name, image: image, description: desc, author: author,}
// 	create a new campground & save to mongo
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		} else {
			console.log(newlyCreated)
			res.redirect("/campgrounds")
		}
	})
})

// SHOW - view a particular campground page via the :id variable
router.get("/:id", function(req, res){
// 	find campground with provided id
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found.')
			res.redirect('back')
		} else {
			console.log(foundCampground)
			// 	render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground})
		}
	})
})

// EDIT campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
// 	is user logged in
		Campground.findById(req.params.id, function(err, foundCampground){
				res.render('campgrounds/edit', {campground: foundCampground})
		})
})

// 		otherwise, redirect
// 		if not, redirect
// 	if not, redirect somewhere

// UPDATE campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
// 	find and update
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect('/campgrounds')
		} else {
			res.redirect('/campgrounds/' + updatedCampground._id)
		}
	})
})

// DELETE campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect('/campgrounds')
		} else {
			res.redirect('/campgrounds')
		}
	})
})

module.exports = router