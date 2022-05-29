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
        if (this.distance === destination.length)
            return this[type];
        let sign = destination[this.distance];
        if (httpMethods.has(sign))
            throw new Error("Using CRUD operations in the path is forbidden");
        if (sign[0] === ":") {
            sign = sign.substr(1);
            for (const path of this.relative)
                if (path.sign === sign)
                    return path.add(type, destination);
            const path = new Path(this.distance + 1, this.fullpath + "/:", sign);
            this.relative.push(path);
            return path.add(type, destination);
        } else if (!this.absolute[sign])
            this.absolute[sign] = new Path(this.distance + 1, this.fullpath + "/", sign);
        return this.absolute[sign].add(type, destination);
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
        const route = this.route.add("endpoint", path.split("/").slice(1, path.at(-1) === "/" ? -1 : Infinity));
        if (route[method])
            throw new Error(`There is already an API at ${method} ${path}`);
        return route[method] = callback;
    }
    addMiddleware(path, middleware) {
        this.route.add("middleware", path.split("/").slice(1, path.at(-1) === "/" ? -1 : Infinity)).push(middleware);
    }
    hasEndpoint(path, method) {
        return this.route.hasEndpoint(path.split("/").slice(1, path.at(-1) === "/" ? -1 : Infinity))[method];
    }
    findEndpoint(request, path) {
        const targets = path.split("/").slice(1, path.at(-1) === "/" ? -1 : Infinity);
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