import { TClientConstructor, TProtocolConstructor, TTransportConstructor, ConnectOptions } from 'thrift';
import { HttpClient } from "@angular/common/http";

export type createConnection = (httpClient: HttpClient ,host: string, port: number, options?: ConnectOptions) => any;
export type createClient = (client, connection) => any;


export interface UrlOptions {
    host: string;
    port: number;
    https: boolean;
}


function parseUrlToUrlOptions (url: string): UrlOptions {
  let parse_http = url.split('://');
      let has_http = parse_http.length > 1;  
  return {
      host: has_http ? parse_http[1].split(':')[0] : url.split(':')[0],
      https: has_http ? parse_http[0] === 'https' : true,
      port: (has_http ? +parse_http[1].split(':')[1] : +url.split(':')[1]) || 80
  };
}


export class ThriftCompiler {
  transport: TTransportConstructor;
  protocol: TProtocolConstructor;
  url: UrlOptions;
  httpClient: HttpClient;
  constructor(httpClient: HttpClient, transport: TTransportConstructor, protocol: TProtocolConstructor, url: UrlOptions | string) {
    this.httpClient = httpClient;
    if (typeof url === 'string') {
      this.url = parseUrlToUrlOptions(url);
    } else {
      this.url = url;
    }
    this.transport = transport;
    this.protocol = protocol;
  }

  getFactory(connectionType: createConnection, clientType: createClient) : ClientFactory {
    return new ClientFactory(this.httpClient, this.transport, this.protocol, connectionType, clientType, this.url);
  };
}


export class ClientFactory {
  transport: TTransportConstructor;
  protocol: TProtocolConstructor;
  url: UrlOptions;
  createConnection: createConnection;
  createClient: createClient;
  httpClient: HttpClient;
  constructor(httpClient: HttpClient,transport: TTransportConstructor, protocol: TProtocolConstructor, connectionType: createConnection,
              clientType: createClient, url: UrlOptions | string) {
    this.httpClient = httpClient;

      
    if ( typeof url === 'string' ) {
      this.url = parseUrlToUrlOptions(url);
    } else {
      this.url = url;
    }
    this.transport = transport;
    this.protocol = protocol;
    this.createConnection = connectionType;
    this.createClient = clientType;
  };

  getClient<TClient>(service: TClientConstructor<TClient>, path: string) : TClient {
    let connection = this.createConnection(this.httpClient, this.url.host, this.url.port, {
      transport: this.transport,
      protocol: this.protocol,
      https: this.url.https,
      path: path
    });
    return this.createClient(service, connection);
  };
}