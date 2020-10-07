"use strict";
const http = require("http"); // console.log(http.STATUS_CODES); console.log(http.METHODS);
const App = require("./lib/app");

let app = new App(http);
// console.log(app.requestDataParsers);
app.listen(8080);
app.get("/", (request, response) => {
	console.log(request.api)
	response.bye("IT WORKED AHAHAHA");
});
app.get("/test/:mongol/test", (request, response) => {
	console.log(request.api)
	response.bye("IT WORKED! AHAHAHA params.mongol = " + request.params.mongol);
});
app.get("/test/:monkey", (request, response) => {

});
app.put("/test/:monk/notzen", (request, response) => {

});
