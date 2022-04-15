const express = require("express");
const app = express();
const cliente = require("./client");
const server = require("./server");

server.init();

async function search(req, res, next){
    let { value } = req.params;
    value = 'WD'
    call = cliente.getDataCache({value: value} , function(err, response) {
        console.log('Data:', response); // API response
        console.log(err);
       });
    call.on('data', function(data) {
        console.log(JSON.parse(JSON.stringify(data)))
        res.send(data)
    });
}

app.get('/', search);

app.listen(8000, () => {
    console.log("Servidor encendido en 8000...");
})