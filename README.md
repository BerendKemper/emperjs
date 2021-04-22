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
<h3>CRUD methods:</h3>
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
					<code>request</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
				</summary>
			</details>
			<details>
				<summary>
					<code>response</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object">&lt;Object&gt;</a>
				</summary>
			</details>
		</ul>
	</details>
</ul>
<h3><code>app.get(path, callback)</code></h3>
Places the <code>callback</code> as a GET method at <code>path</code>.
<h3><code>app.post(path, callback)</code></h3>
Places the <code>callback</code> as a POST method at <code>path</code>.
<h3><code>app.put(path, callback)</code></h3>
Places the <code>callback</code> as a PUT method at <code>path</code>.
<h3><code>app.delete(path, callback)</code></h3>
Places the <code>callback</code> as a DELETE method at <code>path</code>.
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
Static readable and writable property of the <code>server</code>'s <code>IncomingMessage</code> class. This property can only be set by a class that is extended at least by the base class.
<h3><code>App.ServerResponse</code></h3>
Static readable and writable property of the <code>server</code>'s <code>ServerResponse</code> class. This property can only be set by a class that is extended at least by the base class.
<h3><code>App.ApiRegister</code></h3>
Static readable and writable property of the <code>App</code>'s <code>ApiRegister</code> class. This property can only be set by a class that is extended at least by the base class.
<h3><code>App.logger</code></h3>
Static readable property of the <code>App</code>'s logger instance.
<h3><code>App.mimetypes</code></h3>
Static readable and writable property of the <code>App</code>'s mimetypes. These mimetypes are used at the method <code>response</code>.<code>pipeFile</code> to identify a file's extension with the corresponding mimetype.
<h2>Class: <code>Request</code></h2>
<h3><code>request.dataParsers</code></h3>
Static readable property of the <code>Request</code>'s dataParsers instance. 
<h2>Class: <code>Response</code></h2>
<h3><code>response.send(data)</code></h3>
<ul>
	<details>
		<summary>
			<code>data</code> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">&lt;String&gt;</a>|<a href="https://nodejs.org/dist/latest-v14.x/docs/api/buffer.html#buffer_class_buffer">&lt;Buffer&gt;</a>
		</summary>
	</details>
</ul>
Ends the <code>response</code> and invokes the <>