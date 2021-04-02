"use strict";
module.exports = {
	serverKey: Symbol("Access Key Server"),
	checkPermission(key, accessKey) {
		if (key !== accessKey)
			throw new Error("This method is protected");
	}
};