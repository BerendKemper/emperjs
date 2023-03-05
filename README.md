# emperjs
<div>A framework to make a http and https webserver. Has build in an api router and register.</div>
<div><code>npm i emperjs</code></div>

```javascript
const createServer = require("emperjs");
const Server = createServer("https");
const server = new Server();
// or
const Server = require("emperjs")("http");
const server = new Server();
```
<div>
    <h2>createServer(protocol[, options])</h2>
    <ul>
        <details>
            <summary>
                <code>protocol</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;string&gt;</a> Default: <code>"http"</code>
            </summary>
            <div>
                The protocol is <code>"http"</code> or <code>"https"</code>. The factory created class Server extends dynamically from the protocol's Server class.
            </div>
        </details>
        <details>
            <summary>
                <code>options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">&lt;Object&gt;</a> optional
            </summary>
            <ul>
                <details>
                    <summary>
                        <code>logger</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type" target="_blank">&lt;Boolean&gt;</a>
                    </summary>
                    <div>
                        If <code>false</code> the server does not log when the request starts and when the response ends.
                    </div>
                </details>
            </ul>
        </details>
        <details>
            <summary>
                <code>Returns</code> <a href="#class-server">&lt;Server&gt;</a>
            </summary>
            <div>
                Creates a Server class.
            </div>
        </details>
    </ul>
    <div>
        Creates a Server class. The Server is described below.
    </div>
</div>

<div>
    <h2>Class: <code>Server</code></h2>
    <ul><li>Extends: <a href="https://nodejs.org/dist/latest/docs/api/http.html#class-httpserver" target="_blank">http.Server</a> | <a href="https://nodejs.org/dist/latest/docs/api/https.html#class-httpsserver" target="_blank">https.Server</a></li></ul>
</div>

<div>
    <h3><code>new Server()</code></h3>
</div>

<div>
    <h3><code>server.listen(options)</code></h3>
    <ul>
        <details>
            <summary>
                <code>options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">&lt;Object&gt;</a>
            </summary>
            <ul>
                <details>
                    <summary>
                        <code>port</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type" target="_blank">&lt;integer&gt;</a> Default: <code>8080</code>
                    </summary>
                </details>
                <details>
                    <summary>
                        <code>hostname</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;string&gt;</a> Default: <code>"127.0.0.1"</code>
                    </summary>
                </details>
                <details>
                    <summary>
                        <code>listeningListener</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank">&lt;Function&gt;</a>
                    </summary>
                    <div><b><code>function listeningListener() {}</code></b></div>
                    <div>
                        The callback that is invoked when the server is listening.
                    </div>
                </details>
            </ul>
        </details>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-server">&lt;Server&gt;</a>
            </summary>
            <div>
                Allows chaining methods.
            </div>
        </details>
    </ul>
    <div>
        Starts the webserver listening for connections.
    </div>
</div>

<div>
    <h3><code>server.delete(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a DELETE method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.get(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a GET method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.head(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a HEAD method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.options(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a OPTIONS method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.patch(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a PATCH method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.post(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a POST method at the specified path.
    </div>
</div>

<div>
    <h3><code>server.put(path, callback[, options])</code></h3> <a href="#http-methods">&lt;HTTP method&gt;</a>
    <div>
        Places the callback as a PUT method at the specified path.
    </div>
</div>

<div>
    <h3>HTTP methods:</h3>
    <ul>
        <details>
            <summary>
                <code>path</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;string&gt;</a>
            </summary>
            <div>
                Variable parameters are indicated by a forward slash folllowed by a colon, such as <code>/:param1</code>. Parameters are added to the request.params object.
            </div>
        </details>
        <details>
            <summary>
                <code>callback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank">&lt;Function&gt;</a>
            </summary>
            <b><code>function callback(request, response) {}</code></b>
            <ul>
                <details>
                    <summary>
                        <code>request</code> <a href="#class-request">&lt;Request&gt;</a>
                    </summary>
                    <div>
                        An instance of the class from the Server.IncomingMessage.
                    </div>
                </details>
                <details>
                    <summary>
                        <code>response</code> <a href="#class-response">&lt;Response&gt;</a>
                    </summary>
                    <div>
                        An instance of the class from the Server.ServerResponse.
                    </div>
                </details>
            </ul>
        </details>
        <details>
            <summary>
                <code>options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">&lt;Object&gt;</a> optional
            </summary>
            <ul>
                <details>
                    <summary>
                        <code>record</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type" target="_blank">&lt;Boolean&gt;</a>
                    </summary>
                    <div>
                        If set to <code>false</code> it is excluded in the ApiRegister and no record is reported to.
                    </div>
                </details>
            </ul>
        </details>
    </ul>
    <div>
        An incomming request that has found it's route to the path and the corresponding HTTP method invokes the callback. If the request's path does not exist the response return with status <code>400</code> and specifies which part of the path was not identified, else if the request's HTTP method does not exist the response return with status <code>405</code> method not allowed.
    </div>
</div>

<div>
    <h3><code>server.use(path, callback)</code></h3>
    <ul>
        <details>
            <summary>
                <code>path</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;string&gt;</a>
            </summary>
            <div>
                Variable parameters are indicated by a forward slash folllowed by a colon, such as <code>/:param1</code>. Parameters are added to the request.params object.
            </div>
        </details>
        <details>
            <summary>
                <code>callback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank">&lt;Function&gt;</a>
            </summary>
            <b><code>function callback(request, response, next) {}</code></b>
            <ul>
                <details>
                    <summary>
                        <code>request</code> <a href="#class-request">&lt;Request&gt;</a> <b>Required!</b>
                    </summary>
                    <div>
                        An instance of the class from the Server.IncomingMessage.
                    </div>
                </details>
                <details>
                    <summary>
                        <code>response</code> <a href="#class-response">&lt;Response&gt;</a> <b>Required!</b>
                    </summary>
                    <div>
                        An instance of the class from the Server.ServerResponse.
                    </div>
                </details>
                <details>
                    <summary>
                        <code>next</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank">&lt;Function&gt;</a> <b>Required!</b>
                    </summary>
                    <div><b><code>function next() {}</code></b></div>
                    <div>
                        The argument next is a function and must be invoked in order to reach the endpoint.
                    </div>
                </details>
            </ul>
        </details>
    </ul>
    <div>
        Inserts middleware functions at the specified path. Requests at the specified path or requests having crossed the specified path are using the middleware. Middleware functions are invoked before the api endpoint is invoked.
    </div>
</div>

<div>
    <h3><code>server.loadApiRegister(register, reset)</code></h3>
    <ul>
        <details>
            <summary>
                <code>register</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">&lt;Object&gt;</a>
            </summary>
            <div>
                Throws a TypeError when register is not an object.
            </div>
        </details>
        <details>
            <summary>
                <code>reset</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type" target="_blank">&lt;Boolean&gt;</a>
            </summary>
            <div>
                If reset is <code>true</code> sets every endpoint's counter and bytes property to <code>0</code>.
            </div>
        </details>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-server">&lt;Server&gt;</a>
            </summary>
            <div>
                Allows chaining methods.
            </div>
        </details>
    </ul>
    <div>
        Loads an external object to replace the server's apiRegister.
    </div>
</div>

<div>
    <h3><code>server.destroyUnusedRecords()</code></h3>
    <ul>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-server">&lt;Server&gt;</a>
            </summary>
            <div>
                Allows chaining methods.
            </div>
        </details>
    </ul>
    <div>
        Destroys any ApiRecord that does not exist in a route.
    </div>
</div>

<div>
    <h3><code>server.apis</code></h3>
    <div>
        Readable property of the apiRegister's apis property.
    </div>
</div>

<div>
    <h3><code>Server.IncomingMessage</code></h3>
    <div>
        Static readable and writable property of the server's IncomingMessage class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class Request.
    </div>
</div>

<div>
    <h3><code>Server.ServerResponse</code></h3>
    <div>
        Static readable and writable property of the server's ServerResponse class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class Response.
    </div>
</div>

<div>
    <h3><code>Server.Socket</code></h3>
    <div>
        Static readable and writable property of the server's Socket class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class Socket.
    </div>
</div>

<div>
    <h3><code>Server.ApiRecord</code></h3>
    <div>
        Static readable and writable property of the ApiRegister's ApiRecord class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class ApiRecord.
    </div>
</div>

<div>
    <h3><code>Server.logger</code></h3>
    <div>
        Static readable property of the Server's logger instance.
    </div>
</div>

<div>
    <h3><code>Server.mimetypes</code></h3>
    <div>
        Static readable and writable property of the Server's mimetypes. These mimetypes are used at the method response.sendFile to identify a file's extension with the corresponding mimetype.
    </div>
</div>

<div>
    <h2>Class: <code>Socket</code></h2>
    <ul><li>Extends: <a href="https://nodejs.org/dist/latest/docs/api/net.html#class-netsocket" target="_blank">net.Socket</a></li></ul>
    <div>
        This object is created internally by the server in the earliest stage of an incomming request right before the server's connection event is fired. The class Socket can be read from the static property Server.Socket. It can be also be overwritten as long as the value is a class that was extended from Socket.
    </div>
</div>

<div>
    <h2>Class: <code>Request</code></h2>
    <ul><li>Extends: <a href="https://nodejs.org/dist/latest/docs/api/http.html#class-httpincomingmessage" target="_blank">http.IncomingMessage</a></li></ul>
    <div>
        This object is created internally by the server. It is passed as the first parameter to any endpoint's function. It may be used to access response status, headers and data. The class Request can be read from the static property Server.IncomingMessage. It can be also be overwritten as long as the value is a class that was extended from Request.
    </div>
</div>

<div>
    <h3><code>request.body</code></h3>
    <div>
        Property where the request's parsed body is placed in. The body is parsed by an individual requestBodyParser.
    </div>
</div>

<div>
    <h3><code>request.params</code></h3>
    <div>
        Property where the request's path parameters are placed in. If the path to an API was <code>"/path/to/:param1/and/:param2"</code> and a request has a path of <code>"/path/to/aapje/and/12345"</code> then the params would become <code>{ param1: "aapje", param2: "12345" }</code>.
    </div>
</div>

<div>
    <h3><code>request.urlSearchParams</code></h3>
    <div>
        Property where the request's search parameters are placed in. The url search parameters are parsed by Node JS's build-in class <a href="https://nodejs.org/dist/latest/docs/api/url.html#class-urlsearchparams" target="_blank">URLSearchParams</a>. When the request has a path of <code>"/path/to/api?param1=aapje&amp;param2=01234&amp;param2=56789"</code> then the request.urlSearchParams.<a href="https://nodejs.org/dist/latest/docs/api/url.html#urlsearchparamsgetallname" target="_blank">getAll</a>("param2") would return <code>["01234", "56789"]</code>.
    </div>
</div>

<div>
    <h3><code>Request.bodyParsers</code></h3>
    <div>
        Static readable property of the Request's bodyParsers instance. Contains individual requestBodyParser.
    </div>
</div>

<div>
    <h2>Class: <code>Response</code></h2>
    <ul>
        <li>Extends: <a href="https://nodejs.org/dist/latest/docs/api/http.html#class-httpserverresponse" target="_blank">http.ServerResponse</a></li>
    </ul>
    <div>
        This object is created internally by the server. It is passed as the second parameter to an endpoint's function. The class Response can be read from the static property Server.ServerResponse. It can be also be overwritten as long as the value is a class that was extended from Response.
    </div>
</div>

<div>
    <h3><code>response.sendJson(status, data)</code></h3>
    <ul>
        <details>
            <summary>
                <code>status</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type" target="_blank">&lt;integer&gt;</a>
            </summary>
            <a href ="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank">HTTP response status codes</a>
        </details>
        <details>
            <summary>
                <code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object" target="_blank">&lt;Object&gt;</a>
            </summary>
            <div>
                The data object is stringified by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify" target="_blank">JSON.stringify</a>.
            </div>
        </details>
    </ul>
    <div>
        Sends a json object back to the response. This method invokes <a href="https://nodejs.org/dist/latest/docs/api/http.html#responsewriteheadstatuscode-statusmessage-headers" target="_blank">writeHead</a> with status set to <code>200</code> and the headers content-type set to <code>"application/json"</code> and invokes the send method.
    </div>
</div>


<div>
    <h3><code>response.send(data)</code></h3>
    <ul>
        <details>
            <summary>
                <code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;String&gt;</a>|<a href="https://nodejs.org/dist/latest/docs/api/buffer.html#class-buffer" target="_blank">&lt;Buffer&gt;</a>
            </summary>
            <div>
                A <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#static-method-bufferfromstring-encoding" target="_blank">Buffer</a> is created from data if it is a string and it's byte <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#buflength" target="_blank">length</a> is passed over to the method report.
            </div>
        </details>
    </ul>
    <div>
        Invokes the response's <a href="https://nodejs.org/dist/latest/docs/api/http.html#responseenddata-encoding-callback" target="_blank">end</a> and the report method.
    </div>
</div>

<div>
    <h3><code>response.sendError(status, error)</code></h3>
    <ul>
        <details>
            <summary>
                <code>status</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type" target="_blank">&lt;integer&gt;</a>
            </summary>
            <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank">HTTP response status codes</a>
        </details>
        <details>
            <summary>
                <code>error</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank">&lt;Error&gt;</a>
            </summary>
            <div>
                This must be an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error" target="_blank">&lt;Error&gt;</a> because the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack" target="_blank">error.stack</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message" target="_blank">error.message</a> properties from this object are read.
            </div>
        </details>
    </ul>
    <div>
        Uses the Server's logger.error method to log the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack" target="_blank">error.stack</a>, invokes <a href="https://nodejs.org/dist/latest/docs/api/http.html#responsewriteheadstatuscode-statusmessage-headers" target="_blank">writeHead</a> with status and the headers content-type set to <code>"text/plain"</code> and invokes the <a href="https://nodejs.org/dist/latest/docs/api/http.html#responseenddata-encoding-callback" target="_blank">end</a> method with an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message" target="_blank">error.message</a>.
    </div>
</div>

<div>
    <h3><code>response.sendFile(filepath)</code></h3>
    <ul>
        <details>
            <summary>
                <code>filepath</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;String&gt;</a>
            </summary>
            <div>
                If a file does not exist at filepath the response's sendError is invoked with status <code>404</code>.
            </div>
        </details>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-response">&lt;Response&gt;</a>
            </summary>
            <div>
                The response is returned to allow chain invoking multiple calls to sendFile.
            </div>
        </details>
    </ul>
    <div>
        Invoke this method to stream files to the response. The response content-type header are set to the mimetype found from the file that was send, unless the content-type header was already set. If the mimetype was not found within the static property Server.mimetypes the response content-type header is set to <code>"text/plain"</code>. In a single response invoking sendFile more than once results in these files to be appended as one file and send in chunks to the response. This is not the same as creating templates of files but it can provide similair results. A <a href="https://www.npmjs.com/package/ca11back-queue" target="_blank">CallbackQueue</a> ensures that the files are send sequentially. The last call that is not followed by another call to sendFile ends the response.
    </div>
    <div>
        The method sendFile is build to reduce the amount of memory allocated for storing <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#class-buffer" target="_blank">Buffer</a>'s while streaming. The first optimization is that a single readable file can attach an x number of writable contexts. The second optimization is that a single writable context can attach an x number of responses. As the readable file reads chunks <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#class-buffer" target="_blank">&lt;Buffer&gt;</a> from a file, those chunks are send to all responses that were attached to the writable context. That means that when 10 responses have been attached to a single writable context there will be 9 fewer chunks of 16kb in memory. The life cycle of reading a file is <a href="https://nodejs.org/dist/latest/docs/api/fs.html#fsopenpath-flags-mode-callback" target="_blank">open</a> > <a href="https://nodejs.org/dist/latest/docs/api/fs.html#fsstatpath-options-callback" target="_blank">stat</a> > <a href="https://nodejs.org/dist/latest/docs/api/fs.html#fsreadfd-buffer-offset-length-position-callback" target="_blank">read</a> > <a href="https://nodejs.org/dist/latest/docs/api/fs.html#fsclosefd-callback" target="_blank">close</a>. Getting the stat from a file is only used to get the byte-length of a file but this operation consumes more time than the open read and close operations. The readable file recycles the same file-descriptor and byte-length and while there is still a writable context attached, new writable contexts attaching keep the readable file open.
    </div>
</div>

<div>
    <h3><code>response.apiRecord</code></h3>
    <div>
        Readable property of the apiRecord for the endpoint.
    </div>
</div>

<div>
    <h2>Class: <code>RequestBodyParsers</code></h2>
    <div>
        The requestBodyParsers is read from the static property bodyParsers from the Request class.
    </div>
</div>

<div>
    <h3><code>requestBodyParsers[mimetype]</code></h3>
    <div>
        Readable properties containing a requestBodyParser.
    </div>
</div>

<div>
    <h3><code>requestBodyParsers.add(mimetype, parse[, errorMessage])</code></h3>
    <ul>
        <details>
            <summary>
                <code>mimetype</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;String&gt;</a>
            </summary>
            <div>
                A requestBodyParser is accessed by using the mimetype as locator.
            </div>
        </details>
        <details>
            <summary>
                <code>parse</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank">&lt;Function&gt;</a>
            </summary>
            <div><b><code>function parse(body) {}</code></b></div>
            <div>
                This requestBodyParser uses this parse function in order to parse data from incomming requests and put the parsed data in request.body. These parse functions wrapped in a try catch.
            </div>
        </details>
        <details>
            <summary>
                <code>errorMessage</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type" target="_blank">&lt;String&gt;</a> Optional
            </summary>
            <div>
                In case the parse function got an error when parsing this errorMessage is send to the response with the method request.sendError, otherwise the error that was catched by the parser itself is send.
            </div>
        </details>
        <details>
            <summary>
                Returns <code>this</code> <a href="#class-requestbodyparsers" target="_blank">&lt;RequestBodyParsers&gt;</a>
            </summary>
            <div>
                Allows chaining methods.
            </div>
        </details>
    </ul>
    <div>
        Use this method to add a new requestBodyParser. By default requestBodyParsers exist for content-type <code>"application/json"</code> that parses with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" target="_blank">JSON.parse</a> and for content-type <code>"application/x-www-form-urlencoded"</code> that parses with <a href="https://nodejs.org/dist/latest/docs/api/url.html#class-urlsearchparams" target="_blank">URLSearchParams</a>.
    </div>
</div>

<div>
    <h2>Class: <code>ApiRecord</code></h2>
    <div>
        Every HTTP method published is stored in the Server's ApiRegister as an ApiRecord. Every apiRecord stores and updates information from the server's endpoints. This class can be read from the static property Server.ApiRecord.
    </div>
</div>

<div>
    <h3><code>apiRecord.report(byteLength)</code></h3>
    <ul>
        <details>
            <summary>
                <code>byteLength</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type" target="_blank">&lt;integer&gt;</a>
            </summary>
            <div>
                A byteLength can be read from the <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#buflength" target="_blank">length</a> property of a <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#class-buffer" target="_blank">Buffer</a> or can be returned from the static method <a href="https://nodejs.org/dist/latest/docs/api/buffer.html#static-method-bufferbytelengthstring-encoding" target="_blank">Buffer.byteLength<a>.
            </div>
        </details>
    </ul>
    <div>
        Each endpoint is recorded in an ApiRecord from the Server's ApiRegister. Invoking report increments the apiRecord's counter property and adds the byteLength to the apiRecord's bytes property.
    </div>
</div>

<div>
    <h3><code>apiRecord.reset()</code></h3>
    <div>
        This method sets counter and bytes properties to <code>0</code>.
    </div>
</div>

<div>
    <h3><code>apiRecord.counter</code></h3>
    <div>
        This porperty is used to count the amount of times a request has successfully responded. It does not increment when the response's sendError method is invoked.
    </div>
</div>

<div>
    <h3><code>apiRecord.bytes</code></h3>
    <div>
        This property is used to update the amount of bytes written from the server to clients.
    </div>
</div>

<div>
    <h2>Class: <code>Logger</code></h2>
    <div>
        An instance from this class is exported and required throughout the Server's library. The instance can be read from the static property Server.logger.
    </div>
</div>

<div>
    <h3><code>logger.log</code></h3>
    <div>
        Readable and writable property for the log function. If set with a value that is not a function an error is thrown.
    </div>
</div>

<div>
    <h3><code>logger.error</code></h3>
    <div>
        Readable and writable property for the error function. If set with a value that is not a function an error is thrown.
    </div>
</div>
