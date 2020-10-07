"use strict";
function HardExtendable() {
	this.extend = function extend(Class) {
		const protoDescriptors = Object.getOwnPropertyDescriptors(this.prototype);
		delete (protoDescriptors.constructor);
		for (const descriptor in protoDescriptors)
			Object.defineProperty(Class.prototype, descriptor, protoDescriptors[descriptor]);
	};
};
module.exports = HardExtendable;