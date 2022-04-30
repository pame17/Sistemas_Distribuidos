const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname +'/rpc.proto';

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, { 
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const clientProto = grpc.loadPackageDefinition(packageDefinition).item;

const client = new clientProto.Item('server:8001', grpc.credentials.createInsecure());

module.exports = client;
