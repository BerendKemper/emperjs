"use strict";
const http = require("http");
const App = require("./lib/app");


let app = new App(http);
/* console.log(app.requestDataParsers); */
app.loadApiStats({
	"/": {
		"GET": {
			"counter": 10,
			"bytes": 500
		}
	},
	"/v1/tracks/:id": {
		"GET": {
			"counter": 15,
			"bytes": 2500
		}
	}
});
app.get("/", (request, response) => {
	response.send("web page");
});
app.get("/v1/artists/:id", (request, response) => {
	response.send(`looking for artist by ID ${request.params.id}`);
	console.log(response.stats);
});
app.get("/v1/album/:id", (request, response) => {
	response.send(`looking for album by ID ${request.params.id}`);
	console.log(response.stats);
});
app.get("/v1/tracks/:id", (request, response) => {
	response.send(`looking for track by ID ${request.params.id}`);
	console.log(response.stats);
});
app.put("/v1/tracks/:id", (request, response) => {
	response.send(`changing data ${JSON.stringify(request.data)} from a track by the ID ${request.params.id}`);
	console.log(response.stats)
});
app.get("/v1/users/:id", (request, response) => {
	response.send(`looking for user by ID ${request.params.id}`);
	console.log(response.stats)
});
app.get("/v1/playlists/:id", (request, response) => {
	response.send(`looking for playlist by ID ${request.params.id}`);
	console.log(response.stats);
});
app.listen(8080);