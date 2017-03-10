var mongoose = require('mongoose');

var ProvinceSchema = mongoose.Schema({
	province_name : {
		type: String,
		unique: true
	},
	region: { 
		type: mongoose.Schema.Types.ObjectId, ref: 'Region'
	}
});

module.exports = mongoose.model('Province', ProvinceSchema);