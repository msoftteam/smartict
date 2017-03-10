var mongoose = require('mongoose');

var MajorSchema = mongoose.Schema({
	majorName: { type: String }
});

module.exports = mongoose.model('Major', MajorSchema);