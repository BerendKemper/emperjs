"use strict";
const http = require("http");
/* console.log(http.STATUS_CODES); console.log(http.METHODS); */
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
	"/test/:mongol/test": {
		"GET": {
			"counter": 15,
			"bytes": 2500
		}
	}
});
app.get("/", (request, response) => {
	response.bye("IT WORKED AHAHAHA");
	console.log(request.stats);
});
app.get("/test/:mongol/test", (request, response) => {
	response.bye("IT WORKED! AHAHAHA params.mongol = " + request.params.mongol);
	console.log(request.stats);
	request.stats.counter++;
});
app.get("/test/:monkey", (request, response) => {
	response.bye("IT WORKED AHAHAHA");
});
app.put("/test/:monk/notzen", (request, response) => {
	response.bye("IT WORKED AHAHAHA");
});
app.listen(8080);