const express = require("express");
const app = express();
const { Kafka } = require('kafkajs')
const fs = require('fs');
const { Client } = require("pg")

const kafka = new Kafka({
    clientId: 'kafka',
    brokers: ['kafka:9092']
})
const consumer = kafka.consumer({ groupId: 'test-group' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'login', fromBeginning: true })
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
            })
            user = JSON.parse(message.value)
            username = user[0]['username']
            pass = user[0]['password']
            time = user[0]['time']
            const db = new Client({
                user: 'postgres',
                database: 'tarea2',
                password: 'postgres',
                port: '5432',
                host: 'postgres',
            });
            await db.connect()
            await db.query(`INSERT INTO historial(username, pass, fecha) VALUES ('`+username+`', '`+pass+`', '`+time+`')`);
            var query = await db.query(`SELECT fecha FROM historial WHERE username = '`+username+`'`);
            var data = query.rows;
            await db.end();
            count = 0;
            for(var i=0;i<data.length;i++){
                aux = time - parseInt(data[i].fecha)
                if(aux <= 60000){
                    count +=1
                }
            }
            if(count >= 5){
                console.log("Muchos intentos de inicio de sesion...")
                fs.readFile('block.json', function (err, data) {
                    file = JSON.parse(data);
                    file['users-blocked'].push(username)
                    fs.writeFileSync('block.json',JSON.stringify(file))
                });
            }
        },
      })
}
run().catch(console.error)


function blocked(req, res){
    fs.readFile('block.json', function (err, data) {
        var file = JSON.parse(data);
        res.send(file)
    });
}

app.get('/blocked', blocked);

app.listen(8001, () => {
    console.log("Servidor encendido en 8001...");
})
