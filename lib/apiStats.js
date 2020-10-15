"use strict";
function ApiStats(appApiStats, path, method) {
	if (!appApiStats[path])
		appApiStats[path] = {};
	if (appApiStats[path][method])
		Object.setPrototypeOf(appApiStats[path][method], ApiStats.prototype);
	else {
		this.counter = 0;
		this.bytes = 0;
		appApiStats[path][method] = this;
	}
	return appApiStats[path][method];
};
ApiStats.prototype.reset = function reset() {
	this.counter = 0;
	this.bytes = 0;
};
module.exports = ApiStats;