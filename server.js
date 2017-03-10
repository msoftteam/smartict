var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('./config/config');
var mongoose = require('mongoose');

var User = require('./models/user');
var Province = require('./models/province');
var CollegeType = require('./models/college_type');
var Major = require('./models/major');
var EducationDegree = require('./models/education_degree');
var Expertise = require('./models/expertise');
var Region = require('./models/region');

var PORT = process.env.PORT || 3000;

mongoose.connect(config.database);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(morgan('dev'));

app.use(passport.initialize());
require('./config/passport')(passport);

var apiRoutes = express.Router();


// Register new users
apiRoutes.post('/register', function(req, res) {
	if (!req.body.user || !req.body.password) {
		res.json({
			success: false,
			message: 'Please enter user and password.'
		});
	} else {
		var newUser = new User({
			user: req.body.user,
			password: req.body.password
		});

		// Attempt to save the user
		newUser.save(function(err) {
			if (err) {
				return res.json({
					success: false,
					message: 'That user already exists.'
				});
			}
			res.json({
				success: true,
				message: 'Successfully created new user.'
			});
		});
	}
});

apiRoutes.post('/authenticate', function(req, res) {

	console.log(req.body.username);

	User.findOne({
		user: req.body.username
	}, function(err, user) {
		if (err) throw err;

		if (!user) {
			res.send({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else {
			// Check if password matches
			user.comparePassword(req.body.password, function(err, isMatch) {
				if (isMatch && !err) {
					// Create token if the password matched and no error was thrown
					var token = jwt.sign(user, config.secret, {
						expiresIn: 10080 // in seconds
					});
					res.json({
						success: true,
						token: 'JWT ' + token
					});
				} else {
					res.send({
						success: false,
						message: 'Authentication failed. Passwords did not match.'
					});
				}
			});
		}
	});
});

apiRoutes.get('/dashboard', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	res.send('It worked! User id is: ' + req.user._id + '.');
});

// ############################# province ###################################
apiRoutes.post('/province', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	console.log(req.body.region);
	var province = new Province({
		province_name : req.body.provinceName,
		region: req.body.region
	});

	province.save(function(err) {
		if (err) {
			return res.json({
				success: false
			});
		}
		res.json({
			success: true
		});
	});
});

apiRoutes.get('/province', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	/*Province.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load province'
			});
		}
		res.json(docs);
	});*/

	Province.find({}).populate('region').exec(function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load province'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/province', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Province.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load province to update'
			});
		}

		doc.update({
			province_name : req.body.provinceName,
			region: req.body.region
		}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update province'
				});
			}
			res.json({
				success: true,
				message: 'update province success'
			});
		});
	});
});

apiRoutes.delete('/province/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Province.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete province fail'
			});
		}

		res.json({
			success: true,
			message: 'delete province success'
		});
	});
});
// ############################# end province ###################################

// ############################# college type ###################################
apiRoutes.post('/college_type', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	var collegeType = new CollegeType({
		collegeTypeName: req.body.collegeTypeName
	});

	collegeType.save(function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'insert college type not success'
			})
		}
		res.json({
			success: true,
			message: 'insert college type success'
		});
	});
});

apiRoutes.get('/college_type', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	CollegeType.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load college type'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/college_type', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	CollegeType.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load college type to update'
			});
		}

		doc.update({collegeTypeName: req.body.collegeTypeName}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update'
				});
			}
			res.json({
				success: true,
				message: 'update success'
			});
		});
	});
});

apiRoutes.delete('/college_type/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	CollegeType.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete fail'
			});
		}

		res.json({
			success: true,
			message: 'delete success'
		});
	});
});

// ############################# end college type ######################

// ############################# major #################################
apiRoutes.post('/major', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	var major = new Major({
		majorName: req.body.majorName
	});

	major.save(function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'insert not success'
			})
		}
		res.json({
			success: true,
			message: 'insert success'
		});
	});
});

apiRoutes.get('/major', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	Major.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load major'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/major', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Major.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load major to update'
			});
		}

		doc.update({majorName: req.body.majorName}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update'
				});
			}
			res.json({
				success: true,
				message: 'update success'
			});
		});
	});
});

apiRoutes.delete('/major/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Major.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete fail'
			});
		}

		res.json({
			success: true,
			message: 'delete success'
		});
	});
});

// ############################# end major ########################################

// ############################# education degree #################################
apiRoutes.post('/education_degree', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	var educationDegree = new EducationDegree({
		educationName: req.body.educationName
	});

	educationDegree.save(function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'insert not success'
			})
		}
		res.json({
			success: true,
			message: 'insert success'
		});
	});
});

apiRoutes.get('/education_degree', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	EducationDegree.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load education degree'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/education_degree', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	EducationDegree.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load major to update'
			});
		}

		doc.update({educationName: req.body.educationName}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update'
				});
			}
			res.json({
				success: true,
				message: 'update success'
			});
		});
	});
});

apiRoutes.delete('/education_degree/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	EducationDegree.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete fail'
			});
		}

		res.json({
			success: true,
			message: 'delete success'
		});
	});
});

// ############################# end education degree ##############################

// #################################### expertise ##################################
apiRoutes.post('/expertise', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	var expertise = new Expertise({
		expertiseName: req.body.expertiseName
	});

	expertise.save(function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'insert not success'
			})
		}
		res.json({
			success: true,
			message: 'insert success'
		});
	});
});

apiRoutes.get('/expertise', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	Expertise.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load expertise'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/expertise', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Expertise.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load expertise to update'
			});
		}

		doc.update({expertiseName: req.body.expertiseName}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update'
				});
			}
			res.json({
				success: true,
				message: 'update success'
			});
		});
	});
});

apiRoutes.delete('/expertise/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Expertise.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete fail'
			});
		}

		res.json({
			success: true,
			message: 'delete success'
		});
	});
});

// #################################### end expertise ######################

// #################################### region #############################
apiRoutes.post('/region', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	var region = new Region({
		regionName: req.body.regionName
	});

	region.save(function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'insert not success'
			})
		}
		res.json({
			success: true,
			message: 'insert success'
		});
	});
});

apiRoutes.get('/region', passport.authenticate('jwt', {
	session: false
}), function(req, res) {

	Region.find({}, function(err, docs) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load region'
			});
		}
		res.json(docs);
	});
});

apiRoutes.put('/region', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Region.findById(req.body.id, function(err, doc) {
		if (err) {
			res.json({
				success: false,
				message: 'cannot load region to update'
			});
		}

		doc.update({regionName: req.body.regionName}, function(err, doc) {
			if (err) {
				res.json({
					success: false,
					message: 'cannot update'
				});
			}
			res.json({
				success: true,
				message: 'update success'
			});
		});
	});
});

apiRoutes.delete('/region/:id', passport.authenticate('jwt', {
	session: false
}), function(req, res) {
	Region.remove({_id: req.params.id}, function(err) {
		if (err) {
			res.json({
				success: false,
				message: 'delete fail'
			});
		}

		res.json({
			success: true,
			message: 'delete success'
		});
	});
});
// #################################### end region #############################

app.use('/api', apiRoutes);

app.listen(PORT, function() {
	console.log('server running on port ' + PORT);
});