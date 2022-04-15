const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname +'/rpc.proto';
const { Client } = require("pg")
const Redis = require('redis');

const db = new Client({
    user: 'postgres',
    database: 'tarea1',
    password: 'postgres',
    port: '5432',
    host: 'postgres',
});

const redis = Redis.createClient({
    url: 'redis://@redis:6379'
});

var init = function(){  
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    
    let serverProto = grpc.loadPackageDefinition(packageDefinition).item;

    async function searchDB(value) {
        try {
            value = '%'+value+'%';
            await db.connect()
            var query = await db.query(`SELECT * FROM Items WHERE Name LIKE '`+value+`'`);
            var data = JSON.stringify(query.rows);
            await db.end();
            return data;
        } catch (err) {
        console.error(err);
        }
    }
                
    async function getDataDB(call) {
        let value = call.request.value;
        var data = await searchDB(value);
        call.write({ items: data})
        call.end();
    }

    async function getDataCache(call) {
        try{
            var value = call.request.value;
            await redis.connect();
            var cache = await redis.get(value);
            await redis.disconnect();
            if(cache == null){
                console.log("No esta en cache, dejame buscarlo en la base de datos.")
                var data = await searchDB(value);
                await redis.connect();
                await redis.set(value,data);
                await redis.expire(value, 10000);
                await redis.disconnect();
                console.log("Guardando en cache...")
                call.write({ items: data})
                call.end();
            }
            else{
                console.log("Suerte! Se encuenta en cache")
                call.write({ items: cache})
                call.end();
            }

        } catch (err) {
            console.log(err);
        }
    }

    let server = new grpc.Server();
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log("Conectado a servidor gRPC")
    });
    server.addService(serverProto.Item.service, { getDataDB: getDataDB, getDataCache: getDataCache });
}

exports.init = init;
  

    
