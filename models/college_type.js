var mongoose = require('mongoose');

var CollegeTypeSchema = mongoose.Schema({
	collegeTypeName: {
		type: String
	}
});

module.exports = mongoose.model('CollegeType', CollegeTypeSchema);