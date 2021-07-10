const util = require('util');
module.exports = {
    errnoException(error, syscall) {
        const code = util.getSystemErrorName(error);
        const message = syscall + " " + code;
        const ex = new Error(message);
        ex.errno = error;
        ex.code = code;
        ex.syscall = syscall;
        return ex;
    }
};