# Sistemas_Distribuidos

#Herramientas utilizadas:
- Node: para la creacion del servidor y cliente. Los paquetes usados fueron: nodemon, express, @grpc/grpc-js, redis y pg.
- Postgres: para guardar los datos en la base de datos. Se utilizo respecto a la imagen  https://hub.docker.com/r/bitnami/postgresql/ y los datos desde el archivo init.sql de https://gitlab.com/nicolas.nunez2/sd-notes/-/tree/main/tarea1.
- Redis: se utilizo para el guardado de cache. Se utilizo la imagen https://hub.docker.com/r/bitnami/redis/.

#Configuracion Redis
maxmemory nkb (para setear la memoria maxima, no corresponde al valor que se quiere iniciar. Esta en kb para que sea un valor pequeño por las pruebas entre LRU y LFU)
maxmemory-policy allkeys-lru (el meotodo de remocion de LRU)
#maxmemory-policy allkeys-lfu (el metodo de remocion LFU, se encuentra comentado porque se intercalo cual se uso para las pruebas)

#Instrucciones de inicializacion
git clone https://github.com/pame17/Sistemas_Distribuidos
cd tarea1
docker-compose up

