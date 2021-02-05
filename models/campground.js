var mongoose = require('mongoose')

// SCHEMA SETUP - the data blueprint
var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	 author: {
		 id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
			},
// 	associating comments collection into the campground schema
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
})

// associates the db methods with the campground variable
module.exports = mongoose.model("Campground", campgroundSchema)
