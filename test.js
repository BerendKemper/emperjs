fetch("/test", { // No Errors
	method: "PUT",
	headers: { "content-type": "application/json" },
	body: JSON.stringify({ a: 5 })
}).then(response => {
	console.log(response);
	return response.text();
}).then(result => {
	console.log(result);
});

fetch("/test", {
	method: "PUT",
	headers: { "content-type": "appliication/json" }, // Error! apli- i -cation/json
	body: JSON.stringify({ a: 5 })
}).then(response => {
	console.log(response);
	return response.text();
}).then(result => {
	console.log(result);
});

fetch("/test", {
	method: "PUT",
	headers: { "content-type": "application/json" },
	body: "JSON.stringify({ a: 5 })" // Error! body not JSON while content-type is application/json
}).then(response => {
	console.log(response);
	return response.text();
}).then(result => {
	console.log(result);
});