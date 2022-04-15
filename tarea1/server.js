const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const PROTO_PATH = __dirname +'/rpc.proto';
const db = require("./db");

var init = function(){  
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    });
    
    let serverProto = grpc.loadPackageDefinition(packageDefinition).item;




    async function searchDB() {
        try {
            await db.connect()
            const query = await db.query('SELECT * FROM Items');
            var data = query.rows;
            await db.end();
            console.log(data);
        } catch (err) {
        console.error(err);
        }
    }
                
    function getDataDB(call) {
        searchDB();
        let value = call.request.value;
        call.write({ item: [{
        id : "5",
        name : "5",
        price : "5",
        category : "5",
        count :"5"}]
        })


        call.end();

    }
    

    let server = new grpc.Server();
    server.bindAsync('0.0.0.0:4500', grpc.ServerCredentials.createInsecure(),()=>{
        server.start();
        console.log("Conectado a servidor gRPC")
    });
    server.addService(serverProto.Item.service, { getDataDB: getDataDB });

    


}
exports.init = init;
  

    
