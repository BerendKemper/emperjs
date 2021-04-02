"use strict";
module.exports = (child, parent) => {
	const _child = child;
	while (child !== parent) {
		child = Object.getPrototypeOf(child);
		if (child === Object.prototype)
			throw TypeError(`The class ${_child.name} is not a child of ${parent.name}`);
	}
};