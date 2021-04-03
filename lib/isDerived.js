"use strict";
/**
 * Walks up the Target's prototype chain to find if it was derived from Source.
 * @param {*} Target class
 * @param {*} Source class
 */
const isDerived = (Target, Source) => {
	while (Target !== Source) {
		Target = Object.getPrototypeOf(Target);
		if (Target === null)
			return false;
	}
	return true;
};
module.exports = isDerived;