var mongoose = require('mongoose');

var ExpertiseSchema = mongoose.Schema({
	expertiseName: { type: String }
});

module.exports = mongoose.model('Expertise', ExpertiseSchema);