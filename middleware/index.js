const Campground = require('../models/campground'),
	  Comment    = require('../models/comment')

// middleware goes here
const middlewareObj = {
	checkCampgroundOwnership: function(req, res, next){
		if(req.isAuthenticated()) {
			Campground.findById(req.params.id, function(err, foundCampground){
				if (err || !foundCampground){
					req.flash('error', 'Campground not found.')
					res.redirect('back')
				} else {
				// 	does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next()
				} else {
					res.redirect('back')
				}	
				}
			})
		} else {
			req.flash('error', 'Please login.')
			res.redirect('/login')
		}
	},
	checkCommentOwnership: function(req, res, next){
		// 	is user logged in?
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err || !foundComment){
					req.flash('error', 'Comment not found.')
					res.redirect('back')
				} else {
// 				does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next()
				} else {
					req.flash('error', 'Access denied.')
					res.redirect('back')
				}
				}
			})
		} else {
			req.flash('error',  'You need to be logged in to do that.')
			res.redirect('back')
		}
	},
	isLoggedIn: function(req, res, next){
		if(req.isAuthenticated()){
			return next()
		} else {
			req.flash('error', 'Please login first! ')
			return res.redirect('/login')
		}
	}
}

module.exports = middlewareObj