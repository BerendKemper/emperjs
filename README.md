# emperjs
A framework to make a http or https webserver. Has build in an api router and register. <b>This work is still in progress!</b>
<code>npm i emperjs</code>

```javascript
const App = require("emperjs");
```

<h2>Class: <code>App</code></h2>
<h3><code>new App(protocol])</code></h3>
<ul>
	<details>
		<summary>
			<code>protocol</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;string&gt;</a>
		</summary>
		The <code>protocol</code> can be either <code>http</code> or <code>https</code>.
	</details>
</ul>
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
				The callback that is invoked when the server is listening.
			</details>
		</ul>
	</details>
</ul>
Starts the webserver listening for connections.
<h3>HTTP methods:</h3>
<ul>
	<details>
		<summary>
			<code>path</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;string&gt;</a>
		</summary>
		Variable parameters are indicated by a forward slash folllowed by a colon, such as /:<code>param</code>. Parameters are added to the <code>request</code>.<code>params</code> object.
	</details>
	<details>
		<summary>
			<code>callback</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
		<ul>
			<details>
				<summary>
					<code>request</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Request&gt;</a>
				</summary>
				An instance of the class from the <code>App</code>.<code>IncomingMessage</code>.
			</details>
			<details>
				<summary>
					<code>response</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Response&gt;</a>
				</summary>
				An instance of the class from the <code>App</code>.<code>ServerResponse</code>.
			</details>
		</ul>
	</details>
</ul>
An <code>incomming request</code> that has found it's route to this <code>path</code> and it's corresponding <code>HTTP method</code> invokes that <code>callback</code>. If the request's <code>path</code> does not exist the <code>response</code> return with status <code>400</code> and specifies which part of the <code>path</code> was not identified, else if the request's <code>HTTP method</code> does not exist the <code>response</code> return with status <code>405</code> method not allowed.
<h3><code>app.delete(path, callback)</code></h3>
Places the <code>callback</code> as a DELETE method at <code>path</code>.
<h3><code>app.get(path, callback)</code></h3>
Places the <code>callback</code> as a GET method at <code>path</code>.
<h3><code>app.head(path, callback)</code></h3>
Places the <code>callback</code> as a HEAD method at <code>path</code>.
<h3><code>app.options(path, callback)</code></h3>
Places the <code>callback</code> as a OPTIONS method at <code>path</code>.
<h3><code>app.post(path, callback)</code></h3>
Places the <code>callback</code> as a POST method at <code>path</code>.
<h3><code>app.put(path, callback)</code></h3>
Places the <code>callback</code> as a PUT method at <code>path</code>.
<h3><code>app.loadApiRegister(register, reset)</code></h3>
<ul>
	<details>
		<summary>
			<code>register</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
		</summary>
		Throws a TypeError when <code>register</code> is not an object.
	</details>
	<details>
		<summary>
			<code>reset</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type">&lt;Boolean&gt;</a>
		</summary>
		If <code>reset</code> is <code>true</code> sets every endpoint's <code>counter</code> and <code>bytes</code> property to <code>0</code>.
	</details>
</ul>
Loads an external object to replace the <code>app</code>'s <code>apis</code> property from the <code>app</code>'s <code>apiRegister</code>.
<h3><code>app.apis</code></h3>
Readable property of the <code>apiRegister</code>'s <code>apis</code> property.
<h3><code>App.IncomingMessage</code></h3>
Static readable and writable property of the <code>server</code>'s <code>IncomingMessage</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>Request</code>.
<h3><code>App.ServerResponse</code></h3>
Static readable and writable property of the <code>server</code>'s <code>ServerResponse</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>Response</code>.
<h3><code>App.ApiRecord</code></h3>
Static readable and writable property of the <code>ApiRegister</code>'s <code>ApiRecord</code> class. This property can only be set by a class that is extended at least by the base class. If the property is set with the value <code>null</code> it is restored back to the class <code>ApiRecord</code>.
<h3><code>App.logger</code></h3>
Static readable property of the <code>App</code>'s logger instance.
<h3><code>App.mimetypes</code></h3>
Static readable and writable property of the <code>App</code>'s mimetypes. These mimetypes are used at the method <code>response</code>.<code>sendFile</code> to identify a file's extension with the corresponding mimetype.

<h2>Class: <code>Request</code></h2>
<ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage">http.IncomingMessage</a></li></ul>
This object is created internally by the server. It is passed as the first parameter to an endpoint's function. It may be used to access response status, headers and data. The class <code>Request</code> can be read from the <code>App</code>'s static property <code>IncomingMessage</code>. It can be also be overwritten as long as the value is a class that was extended from <code>Request</code>.
<h3><code>request.body</code></h3>
Property where the requests parsed <code>body</code> resides. The <code>body</code> is parsed by an individual <code>requestBodyParser</code>.
<h3><code>Request.bodyParsers</code></h3>
Static readable property of the <code>Request</code>'s <code>bodyParsers</code> instance. Contains individual <code>requestBodyParser</code>.

<h2>Class: <code>Response</code></h2>
<ul><li>Extends: <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse">http.ServerResponse</a></li></ul>
This object is created internally by the server. It is passed as the second parameter to an endpoint's function. The class <code>Response</code> can be read from the <code>App</code>'s static property <code>ServerResponse</code>. It can be also be overwritten as long as the value is a class that was extended from <code>Response</code>.
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
<h3><code>response.send(data)</code></h3>
<ul>
	<details>
		<summary>
			<code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>|<a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer">&lt;Buffer&gt;</a>
		</summary>
		A <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_from_string_encoding">Buffer</a> is created from <code>data</code> if it is a string and it's byte <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_buf_length">length</a> is passed over to the method <code>report</code>.
	</details>
</ul>
Invokes the <code>response</code>'s <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_end_data_encoding_callback">end</a> and the <code>report</code> method.
<h3><code>response.report(byteLength)</code></h3>
<ul>
	<details>
		<summary>
			<code>byteLength</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type">&lt;integer&gt;</a>
		</summary>
		A <code>byteLength</code> can be read from the <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_buf_length">length</a> property of a <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer">Buffer</a> or can be returned from the static method <a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_static_method_buffer_bytelength_string_encoding">Buffer.byteLength<a>.
	</details>
</ul>
Each endpoint is recorded in an <code>ApiRecord</code> from the <code>App</code>'s <code>ApiRegister</code>. Invoking <code>report</code> increments the <code>apiRecord</code>'s counter</code> property and adds the <code>byteLength</code> to the <code>apiRecord</code>'s <code>bytes</code> property.
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
Uses the <code>App</code>'s <code>logger.error</code> method to log the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Stack">error.stack</a>, invokes <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_writehead_statuscode_statusmessage_headers">writeHead</a> with <code>status</code> and the headers <code>"Content-Type"</code> set to <code>"text/plain"</code> and invokes the <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_end_data_encoding_callback">end</a> method with an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message">error.message</a>.
<h3><code>response.sendFile(filepath[, end])</code></h3>
<ul>
	<details>
		<summary>
			<code>filepath</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>
		</summary>
		If a file does not exist at <code>filepath</code> the <code>response</code>'s <code>sendError</code> is invoked with status <code>404</code>.
	</details>
	<details>
		<summary>
			<code>end</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a> Optional
		</summary>
		If <code>end</code> is set to <code>false</code> the <code>response</code> is not ended. Use this to chain invoke multiple <code>sendFile</code>s.
	</details>
	<details>
		<summary>
			Returns <code>this</code> &lt;Response&gt;
		</summary>
		The <code>response</code> is returned to allow chain invoking multiple <code>sendFile</code>s.
	</details>
</ul>
Invoke this method to <a href="https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_open_path_flags_mode_callback">open</a> a file for reading, continuously <a href="https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_fs_read_fd_buffer_offset_length_position_callback">read</a> and <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_write_chunk_encoding_callback">write</a> chunks the size of <code>16kb</code> from the file to the <code>response</code> until reading reached the end of file which <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_end_data_encoding_callback">end</a>s the <code>response</code>. The <code>content-type</code> in the <code>response</code>'s header are set using <a href="https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_response_setheader_name_value">setHeader</a> with the corresponding <code>mimetype</code> found from the <code>App</code>'s static proeprty <code>mimetypes</code>. If the <code>mimetype</code> was not found the <code>response</code> sends a <code>404</code>. Invoking multiple <code>sendFile</code>s in a single <code>request</code> results in the different files to be appended as one file and send in chunks to the <code>response</code>. This is not the same as creating templates of files but it can provide similair results. Only the first file's <code>mimetype</code> is put in the header <code>content-type</code>. A <code>CallbackQueue</code> ensures the files are send sequentially.
<h3><code>response.apiRecord</code></h3>
Readable property of the endpoint's <code>apiRecord</code>

<h2>Class: <code>RequestBodyParsers</code></h2>
The <code>requestBodyParsers</code> is read from the static property <code>bodyParsers</code> from the <code>Request</code> class. The <code>requestBodyParsers</code> is map with a <code>mimetype</code> as key and a <code>requestBodyParser</code> as value.
<h3><code>requestBodyParsers.add(mimetype, parse[, errorMessage])</code></h3>
<ul>
	<details>
		<summary>
			<code>mimetype</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>
		</summary>
		This <code>requestBodyParser</code> is internally accessed by using the <code>mimetype</code> as key.
	</details>
	<details>
		<summary>
			<code>parse</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function">&lt;Function&gt;</a>
		</summary>
		This <code>requestBodyParser</code> uses this <code>parse</code> function in order to parse data from incomming requests and put the parsed data in <code>request</code>.<code>body</code>.
	</details>
	<details>
		<summary>
			<code>errorMessage</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a> Optional
		</summary>
		If an <code>errorMessage</code> is given and the <code>requestBodyParser</code> would fail at parsing an error with this <code>errorMessage</code> is send to the <code>response</code> with the method <code>sendError</code>, otherwise the error thrown by the parser itself is send.
	</details>
</ul>
Use this method to add a new <code>requestBodyParser</code>. On default <code>requestBodyParsers</code> has a <code>requestBodyParser</code> for <code>content-type</code> <code>application/json</code> that parses with <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse">JSON.parse</a> and for <code>content-type</code> <code>application/x-www-form-urlencoded</code> that parses with <a href="https://nodejs.org/dist/latest-v14.x/docs/api/querystring.html#querystring_querystring_parse_str_sep_eq_options">querystring.parse</a>.

<h2>Class: <code>RequestBodyParser</code></h2>
An individual <code>requestBodyParser</code> has a method <code>parse</code> and this is used by the <code>request</code> in order to parse data.

<h2>Class: <code>ApiRecord</code></h2>
Every HTTP method published is stored in the <code>App</code>'s <code>ApiRegister</code> as an <code>ApiRecord</code>. Every <code>apiRecord</code> stores and updates information from the server's endpoints. This class can be read from the <code>App</code>'s static property <code>ApiRecord</code>.
<h3><code>apiRecord.reset()</code></h3>
This method sets <code>counter</code> and <code>bytes</code> properties to <code>0</code>.
<h3><code>apiRecord.counter</code></h3>
This porperty is used to count the amount of times a request has successfully responded. It does not increment when the <code>response</code>'s <code>sendError</code> method is invoked.
<h3><code>apiRecord.bytes</code></h3>
This property is used to update the amount of <code>bytes</code> written from the server to clients.

<h2>Class: <code>Logger</code></h2>
An instance from this class is exported and required throughout the <code>App</code>'s library. The instance can be read from the <code>App</code>'s static property <code>logger</code>.
<h3><code>logger.log</code></h3>
Readable and writable property for the log function. If set with a value that is not a function an error is thrown.
<h3><code>logger.error</code></h3>
Readable and writable property for the error function. If set with a value that is not a function an error is thrown.
