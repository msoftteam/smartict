var mongoose = require('mongoose');

var EducationDegreeSchema = mongoose.Schema({
	educationName : { type : String }
});

module.exports = mongoose.model('EducationDegree', EducationDegreeSchema);