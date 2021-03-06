# Sistemas Distribuidos

Tarea 1 del curso de Sistemas Distribuidos.

Pamela Saldías.

**Herramientas utilizadas:**
- Node: para la creación del servidor y cliente. Los paquetes usados fueron: nodemon, express, @grpc/grpc-js, redis y pg. El servidor gRPC se construyó respecto a la documentación en https://grpc.io/.
- Postgres: para guardar los datos en la base de datos. Se utilizo respecto a la imagen https://hub.docker.com/r/bitnami/postgresql/ y los datos desde el archivo init.sql de https://gitlab.com/nicolas.nunez2/sd-notes/-/tree/main/tarea1.
- Redis: se utilizó para el guardado de cache. Se utilizo la imagen https://hub.docker.com/r/bitnami/redis/. Las configuaciones se realizaron respecto a la documentación en https://redis.io/.
- Docker y docker-compose: para simular la distribucion de cada elemento necesario para hacer la tarea. Esto esta dado por cuatro contenedores: cliente (API REST y cliente gRPC), servidor gRPC, base de datos y redis.

**Configuración Redis**

- maxmemory 50mb (corresponde a la memoria máxima que se utilizara en cache, en este caso se fijó respecto a 50mb)

- maxmemory-policy allkeys-lfu (corresponde al método de remoción cuando el cache se llena, que está dado por LFU que significa the Least Frequently Used)

**Instrucciones de inicialización:**

```
- git clone https://github.com/pame17/Sistemas_Distribuidos

- cd tarea1

- docker-compose up
```

**Comparación de algoritmos**

| LRU | LFU |
| ------------- | ------------- |
| Menos utilizado recientemente | Menos utilizado |
| Necesita identificar la posición de antigüedad de cada elemento en el cache | Necesita mantener la cantidad de veces que ha sido utilizado cada elemento en el cache|
| Mantiene información relevante a corto plazo | Mantiene información relevante a largo plazo |

En el contexto de la tarea, es más conveniente utilizar LFU. Ya que en las tiendas se quiere mantener en cache todos los productos que son los más vendidos a nivel histórico. Pero si por un tiempo estos productos se dejan de vender por un periodo de tiempo van a desaparecer del cache si se utiliza LRU. Por lo cual, al instante en que vuelvan a volverse populares, ya no estarán en el cache.

**Ejemplo de busqueda:**
Para poder hacer las pruebas se necesita hacer la llamada a http://localhost:8000/inventory/search?q=valor_que_se_busca

Por ejemplo:

curl --location --request GET 'http://localhost:8000/inventory/search?q=a'

