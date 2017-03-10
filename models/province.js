var mongoose = require('mongoose');

var ProvinceSchema = mongoose.Schema({
	province_name : {
		type: String,
		unique: true
	}
});

module.exports = mongoose.model('Province', ProvinceSchema);