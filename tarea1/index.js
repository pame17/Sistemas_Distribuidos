const express = require("express");
const app = express();
const redis = require('redis');
const cliente = require("./client");
const server = require("./server");

server.init();

var clientRedis = redis.createClient({
    url: 'redis://@redis:6379'
  });


async function searchDB(req, res, next) {
    try {
        await client.connect()
        const query = await client.query('SELECT * FROM Items')
        var data = query.rows
        await client.end()
        res.send(data);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  }

async function searchCache(req, res, next){
    let value = ["1","2","3"];

    call = cliente.getDataDB({value: value} , function(err, response) {
        console.log('Data:', response); // API response
        console.log(err);
       });
    call.on('data', function(data) {
        console.log(data)
    });

    /*try{
        await clientRedis.connect();
        const value = 'hellod';
        const cache = await clientRedis.get(value);
        console.log(cache)
        //const keys = await clientRedis.keys('*');
        //console.log(keys)
        if(cache == null){
            await clientRedis.set(value,'jamon');
            await clientRedis.expire(value, 50000);
            console.log("No estaba en cache, dejame guardarlo")
        }
        else{
            console.log("Se encuenta en cache: ",cache)
        }
        await clientRedis.disconnect();
        res.send("HOLA MUNDO");
    } catch (err) {
        console.error(err);
        res.status(500);
    }*/
}


app.get('/', searchCache);

app.listen(8000, () => {
    console.log("Servidor encendido en 8000...");
})