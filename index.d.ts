export = emperjs.createServer;
namespace emperjs {
    import * as http from "http";
    import * as net from "net";
    import * as tls from "tls";
    declare function createServer(protocol: 'http' | "https", options: Options): typeof Server;
    interface Options {
        logger?: false | undefined;
    }
    declare class Server extends http.Server {
        constructor(options: ServerOptions);
        listen(options: ListenOptions, listeningListener: () => void): Server;
        delete(path: string, callback: requestCallback, options: RequestOptions): void;
        get(path: string, callback: requestCallback, options: RequestOptions): void;
        head(path: string, callback: requestCallback, options: RequestOptions): void;
        options(path: string, callback: requestCallback, options: RequestOptions): void;
        patch(path: string, callback: requestCallback, options: RequestOptions): void;
        post(path: string, callback: requestCallback, options: RequestOptions): void;
        put(path: string, callback: requestCallback, options: RequestOptions): void;
        use(path: string, callback: middlewareCallback): void;
        /**Loads an external register, copies the previous register's records to the external register and overwrites each record's values. Sets values to 0 if reset was true.*/
        loadApiRegister(register: {
            [path: string]: {
                [key in keyof httpMethods /*as `${Uppercase<string & key>}`*/]?: Record;
            };
        }, reset: boolean): Server;
        /**Destroys any ApiRecord that does not exist in a route*/
        destroyUnusedRecords(): Server;
        /**"http(s)://${address}:${port}*/
        get url(): string;
        get apis(): {
            [path: string]: {
                [key in keyof httpMethods /*as `${Uppercase<string & key>}`*/]?: ApiRecord;
            };
        };
        static get IncomingMessage(): typeof Request
        /**Set this value to null in order to reset it to the base Request class.*/
        static set IncomingMessage(OwnIncomingMessage: typeof Request)
        /**Set this value to null in order to reset it to the base Response class.*/
        static ServerResponse: typeof Response;
        /**Set this value to null in order to reset it to the base Socket class.*/
        static Socket: typeof Socket;
        /**The ApiRecord holds information on the api endpoint. Build in are a counter and bytes. The bytes represents te amount of bytes written from the server to sockets. Set this value to null in order to reset it to the base ApiRecord class.*/
        static ApiRecord: typeof ApiRecord;
        /**Add custom loggers to log incomming messenges, ending responses and to log error messenges*/
        static logger: logger;
        /**Add mimetypes to the dictionary. The mimetypes enables detecting the content-type by the extension from a file and is used in the response's sendFile method.*/
        static mimetypes: {
            [ext: string]: string;
        };
    }
    type ServerOptions = EmperServerOptions & tls.SecureContextOptions & tls.TlsOptions;
    interface EmperServerOptions {
        /**
         * Optionally overrides the value of
         * `--max-http-header-size` for requests received by this server, i.e.
         * the maximum length of request headers in bytes.
         * @default 8192
         */
        maxHeaderSize?: number | undefined;
        /**
         * Use an insecure HTTP parser that accepts invalid HTTP headers when true.
         * Using the insecure parser should be avoided.
         * See --insecure-http-parser for more information.
         * @default false
         */
        insecureHTTPParser?: boolean | undefined;
    }
    interface ListenOptions {
        port?: number | undefined;
        host?: string | undefined;
        backlog?: number | undefined;
    }
    type requestCallback = (request: Request, response: Response) => void;
    type middlewareCallback = (request: Request, response: Response, next: () => void) => void;
    type httpMethods = { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT };
    interface RequestOptions {
        /** When false disables recording the API and it will not be registered in the ApiRegister. */
        record?: false | undefined;
    }
    interface Record {
        bytes: number;
        counter: number;
    }
    interface logger {
        error: log;
        log: log;
        debug: log;
    }
    type log = (...data) => any;
    class Socket extends net.Socket {
        get remoteUrl(): string;
    }
    class Request extends http.IncomingMessage {
        socket: Socket;
        connection: Socket;
        body?: object;
        /**Contains key values identified in the url's path by /:key.*/
        params?: RequestParams;
        urlPath: string;
        urlSearchParams: URLSearchParams;
        static bodyParsers: RequestBodyParsers;
    }
    interface RequestParams {
        [key: string]: string;
    }
    class RequestBodyParsers {
        ["application/json"]: RequestBodyParser;
        ["application/x-www-form-urlencoded"]: RequestBodyParser;
        [mimetype: string]: RequestBodyParser;
        add(mimetype: string, parse: parse, errorMessage: string): RequestBodyParsers;
    }
    type parse = (body: string) => object;
    class RequestBodyParser {
        parse(body: string, request: Request, onParsed: onParsed): void;
    }
    type onParsed = (parsed) => void;
    class Response extends http.ServerResponse {
        socket: Socket;
        connection: Socket;
        sendJson(status: number, data: object): void;
        send(data: Buffer): void;
        send(data: string): void;
        sendError(status: number, error: Error): void;
        sendFile(filepath: string): Response;
        apiRecord?: ApiRecord;
    }
    class ApiRecord {
        bytes: number;
        counter: number;
        /**Adds the byteLength to the total bytes and increments the counter.*/
        report(byteLength: number): Response;
        /**Copies record's counter and bytes properties, if falsy sets them to 0.*/
        from(record: object): void;
        /**Sets counter and bytes to 0.*/
        reset(): ApiRecord;
    }

}