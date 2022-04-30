const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname +'/rpc.proto';
const { Client } = require("pg")

var init = function(){  
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    
    let serverProto = grpc.loadPackageDefinition(packageDefinition).item;
                
    async function getDataDB(call) {
        try {
            value = '%'+call.request.value+'%';
            const db = new Client({
                user: 'postgres',
                database: 'tarea1',
                password: 'postgres',
                port: '5432',
                host: 'postgres',
            });
            await db.connect()
            var query = await db.query(`SELECT * FROM Items WHERE Name LIKE '`+value+`'`);
            var data = query.rows;
            await db.end();
            if(query.rows.length != 0){
                call.write({ items: data})
                call.end();
            }
            else{
                call.write({ items: null})
                call.end();
            }

        } catch (err) {
        console.error(err);
        }
    }

    let server = new grpc.Server();
    server.bindAsync('0.0.0.0:8001', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log("Conectado a servidor gRPC")
    });
    server.addService(serverProto.Item.service, { getDataDB: getDataDB });
}
init();
  

    
