const express = require("express");
const app = express();
const { Kafka } = require('kafkajs')
var bodyParser = require('body-parser');

const kafka = new Kafka({
    clientId: 'kafka',
    brokers: ['kafka:9092']
})
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 


const admin = kafka.admin();
const producer = kafka.producer();

async function init(){
    await admin.connect();
    await admin.createTopics({
        waitForLeaders: true,
        topics: [
          { topic: 'login' },
        ],
    })
    await admin.disconnect();
}
init()
async function login(req, res){
    user = req.body['username']
    pass = req.body['password']
    date = new Date();
    time = date.getTime();
    data = [{username: user, password:pass, time:time}]
    await producer.connect()
    await producer.send({
        topic: 'login',
        messages: [
            { value: JSON.stringify(data) },
        ],
    })
    await producer.disconnect();
    console.log("Data login enviada")
    res.json({data});
}

app.post('/login', login);

app.listen(8000, () => {
    console.log("Servidor encendido en 8000...");
})