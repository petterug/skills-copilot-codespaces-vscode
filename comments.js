// Create web server and listen to port 3000

// Load modules
var http = require('http');
var fs = require('fs');
var qs = require('querystring');
var url = require('url');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Load comments from file
function loadComments() {
    var comments = [];
    try {
        var data = fs.readFileSync('./data/comments.json', 'utf8');
        comments = JSON.parse(data);
    } catch (err) {
        console.error(err);
    }
    return comments;
}

// Save comments to file
function saveComments(comments) {
    try {
        fs.writeFileSync('./data/comments.json', JSON.stringify(comments));
    } catch (err) {
        console.error(err);
    }
}

// Create web server
http.createServer(function (request, response) {
    console.log('Request: ' + request.url);
    var urlObj = url.parse(request.url, true, false);
    var pathname = urlObj.pathname;
    var query = urlObj.query;

    if (pathname == '/submit') {
        // Get comments from file
        var comments = loadComments();

        // Add comment to comments array
        comments.push({
            name: query.name,
            comment: query.comment,
            date: new Date()
        });

        // Save comments to file
        saveComments(comments);

        // Set cookie
        response.writeHead(302, {
            'Set-Cookie': 'name=' + query.name,
            'Location': '/comments.html'
        });
        response.end();
    } else if (pathname == '/comments') {
        // Get comments from file
        var comments = loadComments();

        // Set content type
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });

        // Send comments
        response.end(JSON.stringify(comments));
    } else {
        // Set content type
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        // Read html file
        fs.readFile('./public/comments.html', 'utf8', function (err, data) {
            if (err) {
                console.error(err);
            } else {
                // Send html file to client
                response.end(data);
            }
        });
    }
}).listen(3000);