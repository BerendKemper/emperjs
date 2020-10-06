"use strict";
class Memory {
	constructor() {
		this.now();
	}
	now() {
		const memoryNow = process.memoryUsage();
		this.rss = memoryNow.rss;
		this.heapTotal = memoryNow.heapTotal;
		this.heapUsed = memoryNow.heapUsed;
		this.external = memoryNow.external;
	}
	measure() {
		const memoryNow = process.memoryUsage();
		console.log("usage rss:", memoryNow.rss - this.rss);
		console.log("usage heapTotal:", memoryNow.heapTotal - this.heapTotal);
		console.log("usage heapUsed:", memoryNow.heapUsed - this.heapUsed);
		console.log("usage external:", memoryNow.external - this.external);
	}
};
module.exports = Memory;