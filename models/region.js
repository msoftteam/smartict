var mongoose = require('mongoose');

var RegionSchema = mongoose.Schema({
	regionName: { type: String }
});

module.exports = mongoose.model('Region', RegionSchema);