const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Grab the port variable that Heroku will set
// Either use the PORT environmental variable if running on Heroku, or 3000, if running on the local machine
const port = process.env.PORT || 3000;

// Creates the app
var app = express();

// Register the directory for all of our partials
hbs.registerPartials(__dirname + '/views/partials');

// Sets various Express-related configurations
// Here saying that HBS will be our view engine
app.set('view engine', 'hbs');




// App.use registers middleware
// Call next() to tell the middleware that we're done, otherwise it'll wait forever
app.use((request, response, next) => {
	var now = new Date().toString();

	var log = `${now}: ${request.method} ${request.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log');
		}
	});

	next();
});

// app.use((request, response, next) => {
// 	response.render('maintenance.hbs')
// });

// Serves up files in a static directory
app.use(express.static(__dirname + '/public'));

// Register a mustach helper
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text) => {
	return text.toUpperCase();
});


// Handler for HTTP GET request to root
app.get('/', (request, response) => {
	// response.send('<h1>Hello Express!</h1>');
	// response.send({
	// 	name: 'Derek'
	// 	,likes: ['bananas', 'pb', 'cats']
	// });

	response.render('home.hbs', {
		pageTitle: 'Some Website'
		,welcomeMessage: 'Hi, welcome to my website'
	})
});

app.get('/about', (request, response) => {
	// response.send('About page');

	// renders templates
	response.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/projects', (request, response) => {

	// renders templates
	response.render('projects.hbs', {
		pageTitle: 'Projects Page'
	});
});

app.get('/bad', (request, response) => {
	response.send({
		errorMessage: 'Error handling request'
	});
});

// Bind the application to a port on the machine
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});