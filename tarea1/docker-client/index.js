const express = require("express");
const app = express();
const cliente = require("./client");
const Redis = require('redis');

const redis = Redis.createClient({
    url: 'redis://@redis:6379'
});


async function search(req, res){
    try{
        var value = req.query.q
        await redis.connect();
        const keys = await redis.keys('*');
        console.log(keys.length)
        var cache = await redis.get(value);
        if(cache == null){
            call = cliente.getDataDB({value: value});
            call.on('data', async function(data) {
                console.log("La data no se encuentra en el cache, dejame buscarla en la bdd...")
                if(data.items.length !=  0){
                    await redis.set(value,JSON.stringify(data));
                    await redis.disconnect();
                    console.log("Se encontro en la bdd, guardemoslo en cache...")
                    res.send(data)
                }
                else{
                    await redis.disconnect();
                    res.send("No se encuentra en la base de datos");
                }

            });
        }
        else{
            console.log("Suerte! Se encuenta en cache")
            await redis.disconnect();
            res.send(JSON.parse(cache));
        }
    } catch (err) {
        console.log(err);
    }
}

app.get('/inventory/search', search);

app.listen(8000, () => {
    console.log("Servidor encendido en 8000...");
})