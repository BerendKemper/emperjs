"use strict";
const objectCheck = param => {
	if (typeof param !== "object" || param === null || Array.isArray(param)) throw new TypeError("param must be an object");
}
module.exports = { objectCheck };