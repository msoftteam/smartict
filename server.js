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
	//console.log(req.body.provinceName);
	var province = new Province({
		province_name : req.body.provinceName
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

	Province.find({}, function(err, docs) {
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

		doc.update({province_name : req.body.provinceName}, function(err, doc) {
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

app.use('/api', apiRoutes);

app.listen(3000, function() {
	console.log('server running on port 3000.');
});