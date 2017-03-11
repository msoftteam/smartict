var mongoose = require('mongoose');

var TeacherSchema = mongoose.Schema({
	idCard : { type: String, unique: true },
	name: { type: String },
	birthdate: { type: String },
	tel: { type: String },
	email: { type: String },
	lineID: { type: String },
	address: { type: String },
	graduateDegree: { type: mongoose.Schema.Types.ObjectId, ref: 'EducationDegree' },
	expertise: { type: mongoose.Schema.Types.ObjectId, ref: 'Expertise' },
	collegeType: { type: mongoose.Schema.Types.ObjectId, ref: 'CollegeType' },
	collegeName: { type: String },
	major: { type: mongoose.Schema.Types.ObjectId, ref: 'Major' },
	province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
	region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' }
});

module.exports = mongoose.model('Teacher', TeacherSchema);