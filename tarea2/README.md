# Sistemas Distribuidos

Tarea 2 del curso de Sistemas Distribuidos.

Pamela Saldías.

**Herramientas utilizadas:**
- Node: para la creación del producer y consumer. Los paquetes usados fueron: nodemon, express,kafkajs y pg.
- Kafka y zookeeper: para generar el flujo de transmision de datos. Se utilizo respecto a la imagen https://hub.docker.com/r/bitnami/kafka/ y https://hub.docker.com/_/zookeeper. 
- Postgres: para guardar el historial de inicio de sesion en la base de datos. Se utilizo respecto a la imagen https://hub.docker.com/r/bitnami/postgresql/.
- Docker y docker-compose: para simular la distribucion de cada elemento necesario para hacer la tarea. Esto esta dado por cinco contenedores: producer, consumer, zookeeper, kafka y base de datos.

**Instrucciones de inicialización:**

```
git clone https://github.com/pame17/Sistemas_Distribuidos

cd Sistemas_Distribuidos

cd tarea2

docker-compose up
```

**Preguntas**
1. ¿Por qué Kafka funciona bien en este escenario?

Ya que Kafka es una herramienta para la trasmision de datos, por lo que permitiria administrar y procesar de los registros a medida que los usuarios van haciendo login. De este modo se puede ir evaluando los tiempos de intento de login que va haciendo el usuario y poder bloquearlo. Ademas de esto, este puede dividirse en grupos y particiones para realizar el trabajo de forma mas eficiente.

2. Basado en las tecnologías que usted tiene a su disposición (Kafka, backend) ¿Qué haría usted para manejar una gran cantidad de usuarios al mismo tiempo? 

Se tendrian que generar particiones del topico de modo de paralelizar el tema y generar grupos de consumers para consumir estas particiones. De este modo se podria manejar mayor flujo de usuarios.

**Ejemplo de busqueda:**

Para hacer uso de POST login se debe usar el siguiente CURL: curl -d "username=value1&password=value2" -X POST http://localhost:8000/login

Para hacer uso de GET blocked se debe usar el siguiente CURL: curl --location --request GET 'http://localhost:8001/blocked'

Dentro del repositorio se encuentra dos casos de prueba de bloqueo.
1) En este caso se hace envio de 5 peticiones POST en tiempos instantaneos de modo de simular el bloqueo.
```
bash run.sh
```
2) En este caso se hace envio de 5 peticiones POST pero con intervalos de 20 segundos entre si de modo que el usuario no es bloqueado.
```
bash run2.sh
```

