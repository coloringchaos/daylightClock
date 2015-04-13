// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8080);

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
	
	fs.readFile(__dirname + parsedUrl.pathname, 
		// Callback function for reading
		function (err, data) {
			// if there is an error
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			// Otherwise, send the data, the contents of the file
			res.writeHead(200);
			res.end(data);
  		}
  	);
}

////////////////////
// WebSocket Portion - works with the HTTP server

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {	// We are given a websocket object in our function
	
		console.log("We have a new client: " + socket.id);
		
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});


		socket.on('requestingJson', function() {

			//API REQUEST STUFF - 
			var requestOptions = {
			        host: 'api.openweathermap.org',
			        path: '/data/2.5/weather?id=5128581&units=imperial'
			};

			var requestCallback  = function(response) {
				// contains everything back from the server, in chunks
			    var str = ''; 

		        response.on('data', function (chunk) {
		                str += chunk;
		        });

		        response.on('end', function () {
		                console.log(str);
		                
		                //send the json string to the client side
		                socket.emit('json', str); 
		        });
			};

		// This is the actual request for the page
		http.request(requestOptions, requestCallback).end();
		
		}); //end requestJson


	}//end socket
);

////////////////////






