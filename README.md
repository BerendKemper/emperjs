# emperjs
A framework to make a http and https webserver. Has build in an api router and register. <b>This work is still in progress!</b>
<code>npm i emperjs</code>

```javascript
const AppFactory = require("emperjs");
const App = AppFactory("https");
const app = new App();
// Or
const App = require("emperjs")("http");
const app = new App();
```
<div>
    <h2>AppFactory(protocol)</h2>
    <ul>
        <details>
            <summary>
                <code>protocol</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;string&gt;</a> Default: <code>http</code>
            </summary>
            The protocol is <code>http</code> or <code>https</code>. The factory created class App extends dynamically from the protocol's Server class.
        </details>
        <details>
            <summary>
                <code>Returns</code> &lt;App&gt;
            </summary>
            The factory creates a class App.
        </details>
    </ul>
    <div>
        Creates a class App. The App is described below.
    </div>
</div>

<div>
    <h2>Class: <code>App</code></h2>
    <ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_server">http.Server</a> | <a href="https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_class_https_server">https.Server</a></li></ul>
</div>

<div>
    <h3><code>new App()</code></h3>
</div>

<div>
    <h3><code>app.listen(options)</code></h3>
    <ul>
        <details>
            <summary>
                <code>options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
            </summary>
            <ul>
                <details>
                    <summary>
                        <code>port</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a> Default: <code>8080</code>
                    </summary>
                </details>
                <details>
                    <summary>
                        <code>hostname</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;string&gt;</a> Default: <code>127.0.0.1</code>
                    </summary>
                </details>
                <details>
                    <summary>
                        <code>listeningListener</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
                    </summary>
                    <div><b><code>function listeningListener() {}</code></b></div>
                    The callback that is invoked when the server is listening.
                </details>
            </ul>
        </details>
        <details>
            <summary>
                Returns <code>this</code> &lt;App&gt;
            </summary>
            Allows chaining methods.
        </details>
    </ul>
    <div>
        Starts the webserver listening for connections.
    </div>
</div>

<div>
    <h3>HTTP methods:</h3>
    <ul>
        <details>
            <summary>
                <code>path</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;string&gt;</a>
            </summary>
            Variable parameters are indicated by a forward slash folllowed by a colon, such as <code>/:param1</code>. Parameters are added to the request.params object.
        </details>
        <details>
            <summary>
                <code>callback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
            </summary>
            <b><code>function callback(request, response) {}</code></b>
            <ul>
                <details>
                    <summary>
                        <code>request</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Request&gt;</a>
                    </summary>
                    An instance of the class from the App.IncomingMessage.
                </details>
                <details>
                    <summary>
                        <code>response</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Response&gt;</a>
                    </summary>
                    An instance of the class from the App.ServerResponse.
                </details>
            </ul>
        </details>
        <details>
            <summary>
                <code>options</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a> optional
            </summary>
            <ul>
                <details>
                    <summary>
                        <code>record</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">&lt;Boolean&gt;</a>
                    </summary>
                    If set to <code>false</code> it is excluded in the ApiRegister and no record is reported to.
                </details>
            </ul>
        </details>
    </ul>
    <div>
        An incomming request that has found it's route to the path and the corresponding HTTP method invokes the callback. If the request's path does not exist the response return with status <code>400</code> and specifies which part of the path was not identified, else if the request's HTTP method does not exist the response return with status <code>405</code> method not allowed.
    </div>
    <h3><code>app.delete(path, callback[, options])</code></h3>
    <div>
        Places the callback as a DELETE method at the specified path.
    </div>
    <h3><code>app.get(path, callback[, options])</code></h3>
    <div>
        Places the callback as a GET method at the specified path.
    </div>
    <h3><code>app.head(path, callback[, options])</code></h3>
    <div>
        Places the callback as a HEAD method at the specified path.
    </div>
    <h3><code>app.options(path, callback[, options])</code></h3>
    <div>
        Places the callback as a OPTIONS method at the specified path.
    </div>
    <h3><code>app.patch(path, callback[, options])</code></h3>
    <div>
        Places the callback as a PATCH method at the specified path.
    </div>
    <h3><code>app.post(path, callback[, options])</code></h3>
    <div>
        Places the callback as a POST method at the specified path.
    </div>
    <h3><code>app.put(path, callback[, options])</code></h3>
    <div>
        Places the callback as a PUT method at the specified path.
    </div>
</div>

<div>
    <h3><code>app.loadApiRegister(register, reset)</code></h3>
    <ul>
        <details>
            <summary>
                <code>register</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
            </summary>
            Throws a TypeError when register is not an object.
        </details>
        <details>
            <summary>
                <code>reset</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">&lt;Boolean&gt;</a>
            </summary>
            If reset is <code>true</code> sets every endpoint's counter and bytes property to <code>0</code>.
        </details>
        <details>
            <summary>
                Returns <code>this</code> &lt;App&gt;
            </summary>
            Allows chaining methods.
        </details>
    </ul>
    <div>
        Loads an external object to replace the app's apiRegister.
    </div>
</div>

<h3><code>app.destroyUnusedRecords()</code></h3>
<ul>
    <details>
        <summary>
            Returns <code>this</code> &lt;App&gt;
        </summary>
        Allows chaining methods.
    </details>
</ul>
Destroys any <code>ApiRecord</code> that does not exist in a route.
<h3><code>app.apis</code></h3>
Readable property of the <code>apiRegister</code>'s <code>apis</code> property.
<h3><code>App.IncomingMessage</code></h3>
Static readable and writable property of the <code>server</code>'s <code>IncomingMessage</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>Request</code>.
<h3><code>App.ServerResponse</code></h3>
Static readable and writable property of the <code>server</code>'s <code>ServerResponse</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>Response</code>.
<h3><code>App.Socket</code></h3>
Static readable and writable property of the <code>server</code>'s <code>Socket</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>Socket</code>.
<h3><code>App.ApiRecord</code></h3>
Static readable and writable property of the <code>ApiRegister</code>'s <code>ApiRecord</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>ApiRecord</code>.
<h3><code>App.logger</code></h3>
Static readable property of the <code>App</code>'s logger instance.
<h3><code>App.mimetypes</code></h3>
Static readable and writable property of the <code>App</code>'s mimetypes. These mimetypes are used at the method <code>response</code>.<code>sendFile</code> to identify a file's extension with the corresponding mimetype.

<h2>Class: <code>Socket</code></h2>
<ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/net.html#net_class_net_socket">net.Socket</a></li></ul>
This object is created internally by the server in the earliest stage of an incomming request right before the server's connection event is fired. The class <code>Socket</code> can be read from the static property <code>App.Socket</code>. It can be also be overwritten as long as the value is a class that was extended from <code>Socket</code>.

<h2>Class: <code>Request</code></h2>
<ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage">http.IncomingMessage</a></li></ul>
This object is created internally by the server. It is passed as the first parameter to any endpoint's function. It may be used to access response status, headers and data. The class <code>Request</code> can be read from the static property <code>App.IncomingMessage</code>. It can be also be overwritten as long as the value is a class that was extended from <code>Request</code>.
<h3><code>request.body</code></h3>
Property where the request's parsed <code>body</code> is placed in. The <code>body</code> is parsed by an individual <code>requestBodyParser</code>.
<h3><code>request.params</code></h3>
Property where the request's path parameters are placed in. If the path to an API was <code>"/path/to/:param1/and/:param2"</code> and a request has a path of <code>"/path/to/aapje/and/12345"</code> then the params would become <code>{ param1: "aapje", param2: "12345" }</code>.
<h3><code>request.urlSearchParams</code></h3>
Property where the request's search parameters are placed in. The url search parameters are parsed by Node JS's build-in class <a href="https://nodejs.org/dist/latest-v16.x/docs/api/url.html#class-urlsearchparams">URLSearchParams</a>. When the request has a path of <code>"/path/to/api?param1=aapje&amp;param2=01234&amp;param2=56789"</code> then the request.urlSearchParams.<a href="https://nodejs.org/dist/latest-v16.x/docs/api/url.html#urlsearchparamsgetallname">getAll</a>("param2") would return <code>["01234", "56789"]</code>.
<h3><code>Request.bodyParsers</code></h3>
Static readable property of the <code>Request</code>'s <code>bodyParsers</code> instance. Contains individual <code>requestBodyParser</code>.

<h2>Class: <code>Response</code></h2>
<ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse">http.ServerResponse</a></li></ul>
This object is created internally by the server. It is passed as the second parameter to an endpoint's function. The class <code>Response</code> can be read from the static property <code>App.ServerResponse</code>. It can be also be overwritten as long as the value is a class that was extended from <code>Response</code>.
<h3><code>response.sendJson(status, data)</code></h3>
<ul>
	<details>
		<summary>
			<code>status</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
		</summary>
		<a href ="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status">HTTP response status codes</a>
	</details>
	<details>
		<summary>
			<code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
		</summary>
		The <code>data</code> object is stringified by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify">JSON.stringify</a>.
	</details>
</ul>
Sends a json object back to the <code>response</code>. This method invokes <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_writehead_statuscode_statusmessage_headers">writeHead</a> with <code>status</code> and the headers <code>"Content-Type"</code> set to <code>"application/json"</code> and invokes the <code>send</code> method.

<div>
    <h3><code>response.send(data)</code></h3>
    <ul>
        <details>
            <summary>
                <code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>|<a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer">&lt;Buffer&gt;</a>
            </summary>
            A <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_from_string_encoding">Buffer</a> is created from data if it is a string and it's byte <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_buf_length">length</a> is passed over to the method report.
        </details>
    </ul>
    Invokes the response's <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_end_data_encoding_callback">end</a> and the report method.
</div>

<div>
    <h3><code>response.report(byteLength)</code></h3>
    <ul>
        <details>
            <summary>
                <code>byteLength</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
            </summary>
            A <code>byteLength</code> can be read from the <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_buf_length">length</a> property of a <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer">Buffer</a> or can be returned from the static method <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_bytelength_string_encoding">Buffer.byteLength<a>.
        </details>
        <details>
            <summary>
                Returns <code>this</code> &lt;Response&gt;
            </summary>
            Allows chaining methods.
        </details>
    </ul>
    <div>
        Each endpoint is recorded in an <code>ApiRecord</code> from the <code>App</code>'s <code>ApiRegister</code>. Invoking <code>report</code> increments the <code>apiRecord</code>'s counter</code> property and adds the <code>byteLength</code> to the <code>apiRecord</code>'s <code>bytes</code> property.
    </div>
</div>

<div>
    <h3><code>response.sendError(status, error)</code></h3>
    <ul>
        <details>
            <summary>
                <code>status</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
            </summary>
            <a href ="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status">HTTP response status codes</a>
        </details>
        <details>
            <summary>
                <code>error</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
            </summary>
            This must be an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error">Error</a> because the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack">error.stack</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message">error.message</a> properties from this object are read.
        </details>
    </ul>
    <div>
        Uses the App's logger.error method to log the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack">error.stack</a>, invokes <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_writehead_statuscode_statusmessage_headers">writeHead</a> with status and the headers content-type set to <code>text/plain</code> and invokes the <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_end_data_encoding_callback">end</a> method with an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message">error.message</a>.
    </div>
</div>

<div>
    <h3><code>response.sendFile(filepath)</code></h3>
    <ul>
        <details>
            <summary>
                <code>filepath</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>
            </summary>
            If a file does not exist at filepath the response's sendError is invoked with status <code>404</code>.
        </details>
        <details>
            <summary>
                Returns <code>this</code> &lt;Response&gt;
            </summary>
            The response is returned to allow chain invoking multiple calls to sendFile.
        </details>
    </ul>
    <div>
        Invoke this method to stream files to the response. The response content-type header are set to the mimetype found from the file that was send, unless the content-type header was already set. If the mimetype was not found within the static property App.mimetypes the response content-type header is set to <code>text/plain</code>. In a single response invoking sendFile more than once results in these files to be appended as one file and send in chunks to the response. This is not the same as creating templates of files but it can provide similair results. A <a href="https://www.npmjs.com/package/ca11back-queue">CallbackQueue</a> ensures that the files are send sequentially. The last call that is not followed by another call to sendFile ends the response.
    </div>
    <div>
        The method sendFile is build to reduce the amount of memory allocated for storing <a href="https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#class-buffer">Buffer</a>'s while streaming. The first optimization is that a single readable file can attach an x number of writable contexts. The second optimization is that a single writable context can attach an x number of responses. As the readable file reads chunks <a href="https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#class-buffer">&lt;Buffer&gt;</a> from a file, those chunks are send to all responses that were attached to the writable context. That means that when 10 responses have been attached to a single writable context there will be 9 fewer chunks of 16kb in memory. The life cycle of reading a file is <a href="https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsopenpath-flags-mode-callback">open</a> > <a href="https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsstatpath-options-callback">stat</a> > <a href="https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsreadfd-buffer-offset-length-position-callback">read</a> > <a href="https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsclosefd-callback">close</a>. Getting the stat from a file is only used to get the byte-length of a file but this operation consumes more time than the open read and close operations. The readable file recycles the same file-descriptor and byte-length and while there is still a writable context attached, new writable contexts attaching keep the readable file open.
    </div>
</div>

<h3><code>response.apiRecord</code></h3>
Readable property of the apiRecord for the endpoint.

<h2>Class: <code>RequestBodyParsers</code></h2>
The requestBodyParsers is read from the static property bodyParsers from the Request class.

<h3><code>requestBodyParsers[mimetype]</code></h3>
Readable properties containing a requestBodyParser.

<h3><code>requestBodyParsers.add(mimetype, parse[, errorMessage])</code></h3>
<ul>
	<details>
		<summary>
			<code>mimetype</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>
		</summary>
		A requestBodyParser is accessed by using the mimetype as locator.
	</details>
	<details>
		<summary>
			<code>parse</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
        <div><b><code>function parse(body) {}</code></b></div>
		This requestBodyParser uses this parse function in order to parse data from incomming requests and put the parsed data in request.body. These parse functions wrapped in a try catch.
	</details>
	<details>
		<summary>
			<code>errorMessage</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a> Optional
		</summary>
		In case the parse function got an error when parsing this errorMessage is send to the response with the method request.sendError, otherwise the error that was catched by the parser itself is send.
	</details>
    <details>
        <summary>
            Returns <code>this</code> &lt;RequestBodyParsers&gt;
        </summary>
        Allows chaining methods.
    </details>
</ul>
Use this method to add a new requestBodyParser. By default requestBodyParsers exist for content-type <code>application/json</code> that parses with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse">JSON.parse</a> and for content-type <code>application/x-www-form-urlencoded</code> that parses with <a href="https://nodejs.org/dist/latest-v16.x/docs/api/url.html#class-urlsearchparams">URLSearchParams</a>.

<h2>Class: <code>ApiRecord</code></h2>
Every HTTP method published is stored in the <code>App</code>'s <code>ApiRegister</code> as an <code>ApiRecord</code>. Every <code>apiRecord</code> stores and updates information from the server's endpoints. This class can be read from the static property <code>App.ApiRecord</code>.
<h3><code>apiRecord.reset()</code></h3>
This method sets <code>counter</code> and <code>bytes</code> properties to <code>0</code>.
<h3><code>apiRecord.counter</code></h3>
This porperty is used to count the amount of times a request has successfully responded. It does not increment when the <code>response</code>'s <code>sendError</code> method is invoked.
<h3><code>apiRecord.bytes</code></h3>
This property is used to update the amount of <code>bytes</code> written from the server to clients.

<h2>Class: <code>Logger</code></h2>
An instance from this class is exported and required throughout the <code>App</code>'s library. The instance can be read from the static property <code>App.logger</code>.
<h3><code>logger.log</code></h3>
Readable and writable property for the log function. If set with a value that is not a function an error is thrown.
<h3><code>logger.error</code></h3>
Readable and writable property for the error function. If set with a value that is not a function an error is thrown.
