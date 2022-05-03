"use strict";
const httpMethods = require("./httpMethods");
class Path {
    absolute = {};
    relative = [];
    endpoint = {};
    middleware = [];
    constructor(distance, fullpath = "", sign = "") {
        this.fullpath = fullpath + sign;
        this.distance = distance;
        this.sign = sign;
    }
    add(type, destination) {
        let sign = destination[this.distance];
        if (httpMethods.has(sign))
            throw new Error("Using CRUD operations in the path is forbidden");
        if (sign[0] === ":") {
            sign = sign.substr(1);
            for (const path of this.relative)
                if (path.sign === sign)
                    return path[type](destination);
            const path = new Path(this.distance + 1, this.fullpath + "/:", sign);
            this.relative.push(path);
            return path[type](destination);
        } else if (!this.absolute[sign])
            this.absolute[sign] = new Path(this.distance + 1, this.fullpath + "/", sign);
        return this.absolute[sign][type](destination);
    }
    addEndpoint(destination) {
        if (this.distance === destination.length)
            return this.endpoint;
        return this.add("addEndpoint", destination);
    }
    addMiddleware(destination) {
        if (this.distance === destination.length)
            return this.middleware;
        return this.add("addMiddleware", destination);
    }
    hasEndpoint(destination) {
        if (this.distance === destination.length)
            return this.endpoint;
        let sign = destination[this.distance];
        if (sign[0] === ":") {
            sign = sign.substr(1);
            for (const path of this.relative)
                if (path.sign === sign)
                    return path.hasEndpoint(destination);
        } else if (this.absolute[sign])
            return this.absolute[sign].hasEndpoint(destination);
        return {};
    }
    proceed(request, route) {
        route.paths[this.distance] = this;
        if (this.distance < route.targets.length) {
            const sign = route.targets[this.distance];
            if (this.absolute[sign])
                return this.absolute[sign].proceed(request, route);
            for (const path of this.relative) {
                path.proceed(request, route);
                if (route.found)
                    return request.params[path.sign] = sign;
            }
            if (this.distance > route.faultyPath.distance) {
                route.faultyPath = this;
                route.fault = sign;
            }
        }
        else if (typeof this.endpoint[request.method] === "function")
            return route.found = true;
        else if (this.distance > route.faultyPath.distance)
            route.faultyPath = this;
    }
}
const noFaultyPath = { distance: -1 };
class Routes {
    route = new Path(0);
    addEndpoint(path, method, callback) {
        if (typeof path !== "string")
            throw new TypeError("path must be a String");
        if (path[0] !== "/")
            throw new TypeError('path must start with "/"');
        const pathSplit = path.split("/");
        const route = this.route.addEndpoint(pathSplit.at(-1) === ""
            ? pathSplit.slice(1, -1)
            : pathSplit.slice(1));
        if (route[method])
            throw new Error(`There is already an API at ${method} ${path}`);
        return route[method] = callback;
    }
    addMiddleware(path, middleware) {
        const pathSplit = path.split("/");
        this.route.addMiddleware(pathSplit.at(-1) === ""
            ? pathSplit.slice(1, -1)
            : pathSplit.slice(1)).push(middleware);
    }
    hasEndpoint(path, method) {
        const pathSplit = path.split("/");
        return this.route.hasEndpoint(pathSplit.at(-1) === ""
            ? pathSplit.slice(1, -1)
            : pathSplit.slice(1))[method];
    }
    findEndpoint(request) {
        const urlSplit = request.urlPath.split("/");
        const targets = urlSplit.at(-1) === ""
            ? urlSplit.slice(1, -1)
            : urlSplit.slice(1);
        const route = {
            fault: null,
            faultyPath: noFaultyPath,
            found: false,
            paths: new Array(targets.length),
            targets
        };
        this.route.proceed(request, route);
        return route;
    }
}
module.exports = Routes;