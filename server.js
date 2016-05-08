var express = require('express')
var jwt = require('jwt-simple')
var _ = require('lodash')
var app = express()
var bcrypt = require('bcrypt')
app.use(require('body-parser').json())

var users = [{username: 'dickeyxxx', password: '$2a$10$SqZw8TtcfcCJw1SxUf7Ub.yy6b.zzxvl347H6RjZiNXzOVBR3mrtO'}]
var secretKey = 'supersecretkey'

function findUserByUsername(username) {
	return _.find(users, {username: username})
}

function validateUser(user, password, cb) {
		bcrypt.compare(password, user.password, cb)
}

app.post('/session', function (req, res) {
	var user = findUserByUsername(req.body.username)
	validateUser(user, req.body.password, function (err, valid) {
		if (err || !valid) { return res.send(401) }
		var token = jwt.encode({username: user.username}, secretKey)
		res.json(token)
	})
})

app.get('/user', function (req, res) {
	var token = req.headers['x-auth']
	var user = jwt.decode(token, secretKey)
	//TODO: pull user info from database
	res.json(user)
})

app.listen(3000)