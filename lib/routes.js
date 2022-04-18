"use strict";
const httpMethods = require("./httpMethods");
class Route {
    absolute = {};
    relative = [];
    endpoint = {};
    constructor(distance, fullpath = "", sign = "") {
        this.fullpath = fullpath + sign;
        this.distance = distance;
        this.sign = sign;
    }
    add(destination) {
        if (this.distance === destination.length)
            return this.endpoint;
        let sign = destination[this.distance];
        if (httpMethods.has(sign))
            throw new Error("Using CRUD operations in the path is forbidden");
        if (sign[0] === ":") {
            sign = sign.substr(1);
            for (const route of this.relative)
                if (route.sign === sign)
                    return route.add(destination);
            const route = new Route(this.distance + 1, this.fullpath + "/:", sign);
            this.relative.push(route);
            return route.add(destination);
        } else if (!this.absolute[sign])
            this.absolute[sign] = new Route(this.distance + 1, this.fullpath + "/", sign);
        return this.absolute[sign].add(destination);
    }
    has(destination) {
        if (this.distance === destination.length) return this.endpoint;
        let sign = destination[this.distance];
        if (sign[0] === ":") {
            sign = sign.substr(1);
            for (const route of this.relative)
                if (route.sign === sign)
                    return route.has(destination);
        } else if (this.absolute[sign])
            return this.absolute[sign].has(destination);
        return {};
    }
    proceed(request, targets, context) {
        const sign = targets[this.distance];
        if (this.absolute[sign])
            return this.absolute[sign].proceed(request, targets, context);
        if (this.distance < targets.length) {
            for (const route of this.relative) {
                const maybeTargetAPI = route.proceed(request, targets, context);
                if (context.found) {
                    request.params[route.sign] = sign;
                    return maybeTargetAPI;
                }
            }
            if (this.distance > context.faultyRoute.distance) {
                context.faultyRoute = this;
                context.fault = sign;
            }
        }
        else if (typeof this.endpoint[request.method] === "function") {
            context.found = true;
            return this.endpoint[request.method];
        }
        else if (this.distance > context.faultyRoute.distance) {
            context.faultyRoute = this;
            context.fault = sign;
        }
    }
}
const noFaultyRoute = { distance: -1 };
class Routes {
    route = new Route(0);
    add(path, method, callback) {
        if (typeof path !== "string") throw new TypeError("path must be a String");
        if (path[0] !== "/") throw new TypeError('path must start with "/"');
        const route = this.route.add(path.split("/").slice(1));
        if (route[method]) throw new Error(`There is already an API at ${method} ${path}`);
        return route[method] = callback;
    }
    has(path, method) {
        return this.route.has(path.split("/").slice(1))[method];
    }
    walk(request) {
        const targets = request.urlPath.split("/").slice(1);
        const context = { fault: null, faultyRoute: noFaultyRoute, found: false };
        const api = this.route.proceed(request, targets, context);
        if (api) {
            request.socket._httpMessage.apiRecord = api.apiRecord;
            api(request, request.socket._httpMessage);
        } else if (context.faultyRoute.distance < targets.length)
            request.socket._httpMessage.sendError(400, new Error(`Could not identify "/${context.fault}" in "${request.urlPath}"`));
        else
            request.socket._httpMessage.sendError(405, new Error(`Method ${request.method} not allowed in the endpoint "${context.faultyRoute.fullpath}"`));
    }
}
module.exports = Routes;