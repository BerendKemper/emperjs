import { Server, IncomingMessage, ServerResponse } from "http"
import * as net from "net"
type httpMethods = { DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT }
class App extends Server {
    constructor(options: { insecureHTTPParser: boolean, maxHeaderSize: number })
    listen(options: { port: number, hostname: string, backlog: number }, listeningListener: function(): void): App
    delete(path: string, callback: requestCallback, options: requestOptions): void
    get(path: string, callback: requestCallback, options: requestOptions): void
    head(path: string, callback: requestCallback, options: requestOptions): void
    options(path: string, callback: requestCallback, options: requestOptions): void
    patch(path: string, callback: requestCallback, options: requestOptions): void
    post(path: string, callback: requestCallback, options: requestOptions): void
    put(path: string, callback: requestCallback, options: requestOptions): void
    /**Loads an external register, copies the previous register's records to the external register and overwrites each record's values. Sets values to 0 if reset was true.*/
    loadApiRegister(register: { [path: string]: { [key in keyof httpMethods /*as `${Uppercase<string & key>}`*/]: { bytes: number, counter: number } } }, reset: boolean): App
    /**Destroys any ApiRecord that does not exist in a route*/
    destroyUnusedRecords(): App
    /**"http(s)://${address}:${port}*/
    get url(): string
    get apis(): { [path: string]: { [key in keyof httpMethods /*as `${Uppercase<string & key>}`*/]: ApiRecord } }
    static get IncomingMessage(): typeof Request
    /**Set this value to null in order to reset it to the base Request class.*/
    static set IncomingMessage(IncomingMessage: Request): void
    static get ServerResponse(): typeof Response
    /**Set this value to null in order to reset it to the base Response class.*/
    static set ServerResponse(ServerResponse: Response): void
    static get Socket(): typeof Socket
    /**Set this value to null in order to reset it to the base Socket class.*/
    static set Socket(Socket: Socket): void
    static get ApiRecord(): typeof ApiRecord
    /**The ApiRecord holds information on the api endpoint. Build in are a counter and bytes. The bytes represents te amount of bytes written from the server to sockets. Set this value to null in order to reset it to the base ApiRecord class.*/
    static set ApiRecord(ApiRecord: ApiRecord): void
    static get logger(): logger
    static get mimetypes(): { [ext: string]: string }
    /**Add mimetypes to the dictionary. The mimetypes enables detecting the content-type by the extension from a file and is used in the response's sendFile method.*/
    static set mimetypes(mimetypes: { [ext: string]: string }): void
}
type AppFactory = (protocol: string, options: {}) => typeof App
type requestCallback = (request: Request, response: Response) => void
type requestOptions = { record: false }
class Request extends IncomingMessage {
    socket: Socket
    connection: Socket
    body?: object
    /**Contains key values identified in the url's path by /:key.*/
    params?: { [key: string]: string }
    urlPath: string
    urlSearchParams: URLSearchParams
    static get bodyParsers(): RequestBodyParsers
}
class Response extends ServerResponse {
    socket: Socket
    connection: Socket
    sendJson(status: number, data: object): void
    send(data: Buffer): void
    send(data: string): void
    report(byteLength: number): Response
    sendError(status: number, error: Error): void
    sendFile(filepath: string): Response
    get apiRecord(): void
}
class Socket extends net.Socket {
    get hrtimeAlive(): [number, number]
    get msTimeAlive(): number
    get remoteUrl(): string
}
class ApiRecordBase {
    bytes: number
    counter: number
}
class ApiRecord {
    bytes: number
    counter: number
    /**Copies record's counter and bytes properties, if falsy sets them to 0.*/
    from(record: object): void
    /**Sets counter and bytes to 0*/
    reset(): ApiRecord
}
type logger = { error: log, log: log }
type log = (...data) => any
class RequestBodyParsers {
    ["application/json"]: RequestBodyParser
    ["application/x-www-form-urlencoded"]: RequestBodyParser
    [x: string]: RequestBodyParser
    add(mimetype: string, parse: parse, errorMessage: string): RequestBodyParsers
}
type parse = (body: string) => object
class RequestBodyParser {
    parse(body: string, request: Request, onParsed: onParsed): void
}
type onParsed = (parsed) => void