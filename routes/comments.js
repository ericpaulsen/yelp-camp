const express = require('express'),
	  router  = express.Router({mergeParams: true}),
	  Comment = require('../models/comment'),
	  Campground = require('../models/campground'),
	  middleware = require('../middleware')

// ================
// COMMENTS ROUTES
// ================

// NEW Comment
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

// CREATE - campgrounds/:id/comments
router.post('/', middleware.isLoggedIn, function(req, res){
	// 	lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
			res.redirect('/campgrounds')
		} else {
			// create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash('error', 'Something went wrong.')
					console.log(err)
				} else {
// 					associate comment to campgrounds
// 					add username & id to comment
					comment.author.id = req.user._id
					comment.author.username = req.user.username
					comment.save()
// 					save comment
					campground.comments.push(comment)
					campground.save()
					console.log(comment)
					req.flash('success', 'Successfully posted comment.')
					// 	redirect to campground show page
					res.redirect('/campgrounds/' + campground._id)
				}
			})
		}
	})
})

// EDIT - comments edit route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash('error', 'Campground not found.')
			return res.redirect('back')
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
			res.redirect('back')
			} else {
			res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
			}
		})
	})
})

// UPDATE - comments update route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect('back')
		} else {
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

// DESTROY - comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
// 	findbyIDAndremove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect('back')
		} else {
			req.flash('success', 'Comment deleted.')
			res.redirect('/campgrounds/' + req.params.id)
		}
	})
})

module.exports = router