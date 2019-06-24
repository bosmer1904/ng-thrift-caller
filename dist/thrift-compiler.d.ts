import { TClientConstructor, TProtocolConstructor, TTransportConstructor, ConnectOptions } from 'thrift';
import { HttpClient } from "@angular/common/http";
export declare type createConnection = (httpClient: HttpClient, host: string, port: number, options?: ConnectOptions) => any;
export declare type createClient = (client: any, connection: any) => any;
export interface UrlOptions {
    host: string;
    port: number;
    https: boolean;
}
export declare class ThriftCompiler {
    transport: TTransportConstructor;
    protocol: TProtocolConstructor;
    url: UrlOptions;
    httpClient: HttpClient;
    constructor(httpClient: HttpClient, transport: TTransportConstructor, protocol: TProtocolConstructor, url: UrlOptions | string);
    getFactory(connectionType: createConnection, clientType: createClient): ClientFactory;
}
export declare class ClientFactory {
    transport: TTransportConstructor;
    protocol: TProtocolConstructor;
    url: UrlOptions;
    createConnection: createConnection;
    createClient: createClient;
    httpClient: HttpClient;
    constructor(httpClient: HttpClient, transport: TTransportConstructor, protocol: TProtocolConstructor, connectionType: createConnection, clientType: createClient, url: UrlOptions | string);
    getClient<TClient>(service: TClientConstructor<TClient>, path: string): TClient;
}
