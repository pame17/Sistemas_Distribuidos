const express = require("express");
const cassandra = require('cassandra-driver');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const client = new cassandra.Client({
    contactPoints: ['cassandra-node1', 'cassandra-node2', 'cassandra-node3'],
    localDataCenter: 'datacenter1',
    authProvider: new cassandra.auth.PlainTextAuthProvider('cassandra', 'password123'),
    keyspace: 'prueba'
  });
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

async function create(req, res){
    try{
        const data = await client.execute('SELECT * FROM paciente WHERE rut = ? ALLOW FILTERING', [ req.body.rut ], { prepare: true });
        if(data.first() == null){
            var id_paciente = uuidv4();
            var id_receta = uuidv4();
            const query1 = 'INSERT INTO paciente (id, nombre, apellido, rut, email, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?)';
            const query2 = 'INSERT INTO recetas (id, id_paciente, comentario, farmacos, doctor) VALUES (?, ?, ?, ?,  ?)';
            await client.execute(query1, [id_paciente, req.body.nombre, req.body.apellido, req.body.rut, req.body.email, req.body.fecha_nacimiento ], { prepare: true });
            await client.execute(query2, [id_receta, id_paciente, req.body.comentario, req.body.farmacos, req.body.doctor ], { prepare: true });
            console.log("Paciente nuevo");
            res.send(id_receta);
        }
        else{
            var id_receta = uuidv4();
            const query1 = 'INSERT INTO recetas (id, id_paciente, comentario, farmacos, doctor) VALUES (?, ?, ?, ?,  ?)';
            await client.execute(query1, [id_receta, data.first().id, req.body.comentario, req.body.farmacos, req.body.doctor ], { prepare: true });
            console.log("Paciente antiguo");
            res.send(id_receta);
        }
    } catch (err) {
        console.log(err);
    }
}
async function edit(req, res){
    try{
        const data = await client.execute('SELECT * FROM recetas WHERE id = ? ALLOW FILTERING', [ req.body.id ], { prepare: true });
        if(data.first() != null){
            const query1 = 'UPDATE recetas SET comentario = ?, farmacos = ?, doctor = ? WHERE id = ?';
            await client.execute(query1, [req.body.comentario, req.body.farmacos, req.body.doctor, req.body.id], { prepare: true });
            console.log("Receta existe, se va a editar...")   
            res.send("Receta editada")
        }
        else{
            console.log("La receta no existe")
            res.send("No existe una receta con ese ID")
        }
    } catch (err) {
        console.log(err);
    }
}
async function del(req, res){
    try{
        const data = await client.execute('SELECT * FROM recetas WHERE id = ? ALLOW FILTERING', [ req.body.id ], { prepare: true });
        if(data.first() != null){
            const query1 = 'DELETE FROM recetas WHERE id = ?';
            await client.execute(query1, [req.body.id ], { prepare: true });
            console.log("Receta existe, se va a eliminar...")   
            res.send("Receta eliminada")
        }
        else{
            console.log("La receta no existe")
            res.send("No existe una receta con ese ID")
        }

    } catch (err) {
        console.log(err);
    }
}

async function pacientes(req, res){
    try{
        const data = await client.execute('SELECT * FROM paciente', [ ]);
        res.send(data.rows)
    } catch (err) {
        console.log(err);
    }
}
async function recetas(req, res){
    try{
        const data = await client.execute('SELECT * FROM recetas', [ ]);
        res.send(data.rows)
    } catch (err) {
        console.log(err);
    }
}

app.post('/create', create);
app.post('/edit', edit);
app.post('/delete', del);
app.get('/pacientes', pacientes)
app.get('/recetas', recetas)

app.listen(8000, () => {
    console.log("Servidor encendido en 8000...");
})