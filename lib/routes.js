"use strict";
const httpMethods = require("./httpMethods");
class Route {
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
            for (const route of this.relative)
                if (route.sign === sign)
                    return route[type](destination);
            const route = new Route(this.distance + 1, this.fullpath + "/:", sign);
            this.relative.push(route);
            return route[type](destination);
        } else if (!this.absolute[sign])
            this.absolute[sign] = new Route(this.distance + 1, this.fullpath + "/", sign);
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
            for (const route of this.relative)
                if (route.sign === sign)
                    return route.hasEndpoint(destination);
        } else if (this.absolute[sign])
            return this.absolute[sign].hasEndpoint(destination);
        return {};
    }
    proceed(request, targets, context) {
        context.route[this.distance] = this;
        if (this.distance < targets.length) {
            const sign = targets[this.distance];
            if (this.absolute[sign])
                return this.absolute[sign].proceed(request, targets, context);
            for (const route of this.relative) {
                route.proceed(request, targets, context);
                if (context.found)
                    return request.params[route.sign] = sign;
            }
            if (this.distance > context.faultyRoute.distance) {
                context.faultyRoute = this;
                context.fault = sign;
            }
        }
        else if (typeof this.endpoint[request.method] === "function") {
            return context.found = true;
        }
        else if (this.distance > context.faultyRoute.distance) {
            context.faultyRoute = this;
        }
    }
}
const noFaultyRoute = { distance: -1 };
class Routes {
    route = new Route(0);
    constructor(emper) {
        this.emper = emper;
    }
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
        const context = { fault: null, faultyRoute: noFaultyRoute, found: false, route: [] };
        const response = request.socket._httpMessage;
        this.route.proceed(request, targets, context);
        if (context.found)
            this.emper.handleEndpoint(request, response, context.route);
        else if (context.faultyRoute.distance < targets.length)
            response.sendError(400, new Error(`Could not identify "/${context.fault}" in "${request.urlPath}"`));
        else
            response.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${context.faultyRoute.fullpath}"`));
    }
}
module.exports = Routes;