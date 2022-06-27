# Sistemas Distribuidos

Tarea 3 del curso de Sistemas Distribuidos.

Pamela Saldías.

**Herramientas utilizadas:**
- Node: para la creación de la api-rest que permite hacer el CRUD. Los paquetes usados fueron: nodemon, express, uuid y cassandra-drive.
- Cassandra: para generar la base de datos no relacional. Se hizo respecto a la imagen https://hub.docker.com/r/bitnami/cassandra/
- Docker y docker-compose: para simular la distribucion de cada elemento necesario para hacer la tarea. Esto esta dado por cuatro contenedores: api-rest y 3 nodos cassandra.

**Instrucciones de inicialización:**

```
git clone https://github.com/pame17/Sistemas_Distribuidos

cd Sistemas_Distribuidos

cd tarea3

docker-compose up
```

**Preguntas**
1. Explique la arquitectura que Cassandra maneja. Cuando se crea el clúster ¿Cómo los nodos se conectan? ¿Qué ocurre cuando un cliente realiza una petición a uno de los nodos? ¿Qué ocurre cuando uno de los nodos se desconecta? ¿La red generada entre los nodos siempre es eficiente? ¿Existe balanceo de carga?

Cassandra utiliza una arquitectura peer-to-peer, por lo tanto los datos se encuentran distribuidos en todos los nodos del cluster (con balanceo de carga) permitiendo de esta manera asegurar una tolerancia a fallos. Los nodos estan conectados por un anillo en donde cada nodo solo se puede conectar con sus vecinos adyacentes y cada nodo puede tomar el rol de coordinador (esto definido por el driver). De este modo los datos son distribuidos de forma equitativa sobre los nodos y entre si se producen replicas dado la politica que se defina en la configuracion de cassandra. Por otra parte, si un nodo se desconecta el resto de los nodos es notificado de esto y los datos que este tenia no se perderan dado que se encontrara replicado en uno de los nodos dentro del cluster. Mientras que cuando un cliente consulta a un nodo, este ultimo se vuelve el coordinador de la consulta y se encarga de designar a quien debe responderle a el cliente.

Respecto a la eficiencia de su uso. Esto depende, dado que su uso es recomendado cuando se quiere utilizar grandes volumenes de datos pero de forma simplificada y donde no hay relacion entre tablas, dado que este no soporta JOINS y por otra parte, consume mucho por lo que si son pocos datos sigue siendo mas recomendable una SQL.

2. Cassandra posee principalmente dos estrategias para mantener redundancia en la replicación de datos. ¿Cuáles son estos? ¿Cuál es la ventaja de uno sobre otro? ¿Cuál utilizaría usted para en el caso actual y por qué? Justifique apropiadamente su respuesta.

El primer metodo es SimpleStrategy, este se utiliza cuando hay una sola data center y las replicas son posicionadas en direccion de las manecillas del reloj. El segundo metodo es NetworkTopologyStrategy, este se utiliza cuando hay dos o mas data center y las replicas son creadas por cada data center por separado y las va generando en direccion de las manecillas del reloj. Por lo que, la diferencia esta dada respecto a la cantidad de data center que se quieren utilizar.

En este caso utilizaria SimpleStrategy dado la simplicidad del problema a resolver en donde con un solo data center basta para resolver el ejericio.

3. Teniendo en cuenta el contexto del problema ¿Usted cree que la solución propuesta es la correcta? ¿Qué ocurre cuando se quiere escalar en la solución? ¿Qué mejoras implementaría? Oriente su respuesta hacia el Sharding (la replicación/distribución de los datos) y comente una estrategia que podría seguir para ordenar los datos.

Dado el contexto de la tarea en donde esta dado por un sistema de salud en donde pueden haber muchos pacientes cada uno con una cantidad de recetas, es esperable una gran cantidad de datos por lo que el uso de cassandra es adecuado y dado que las consultas son simples cassandra cumple bien con su cometido. Respecto a la escalabilidad se podria generar mayor numero de nodos dentro del cluster y continuar con replicaciones mas acorde a cada tabla. Dado que siempre existiran mas recetas que pacientes, se podrian generar mayor cantidad de replicas sobre las recetas que los pacientes.

**Ejemplo de busqueda:**

Para hacer uso de POST create se debe usar el siguiente CURL: curl -d "nombre=1&apellido=2&rut=3&email=4&fecha_nacimiento=5&comentario=6&farmacos=7l&doctor=8" -X POST http://localhost:8000/create

Para hacer uso de POST edit se debe usar el siguiente CURL: curl -d "id=1&comentario=2&farmacos=3&doctor=4" -X POST http://localhost:8000/edit

Para hacer uso de POST delete se debe usar el siguiente CURL: curl -d "id=1" -X POST http://localhost:8000/delete

Dentro del repositorio se encuentra un archivo run.sh que se puede usar de prueba. Por motivos de comodidad la salida de POST create retorna el id_receta para poder hacer las pruebas de este archivo.

1. Genera un nuevo paciente y una nueva receta.
2. Genera una nueva receta sobre un paciente existente.
3. Se modifica una receta (el id se obtiene de la primera accion realizada, es decir, la receta de "comentario":"Amigdalitis","doctor":"El Waton de la Fruta","farmacos":"Paracetamol")
4. Se elimina la receta modificada.
```
bash run.sh
```
![Image text](https://github.com/pame17/Sistemas_Distribuidos/blob/main/tarea3/ejemplo.png)

